import { Request } from "express-jwt";
import { NextFunction, Response } from "express";
import { Logger } from "winston";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidv4 } from "uuid";
import { ProductService } from "./productService";
import { FileStorage } from "../common/types/storage";
import createHttpError from "http-errors";
import { FilterData, IProduct, ProductEvents } from "./productTypes";
import mongoose from "mongoose";
import { customPaginateLabels } from "../config/customPaginateLabels";
import { MessageProducerBroker } from "../common/types/brokers";
import config from "config";
import { mapToObject } from "../utils";

export class ProductController {
    constructor(
        private productService: ProductService,
        private logger: Logger,
        private storage: FileStorage,
        private messageProducerBroker: MessageProducerBroker,
    ) {}

    createProduct = async (req: Request, res: Response, next: NextFunction) => {
        // Validate the request body
        const {
            name,
            description,
            image,
            priceConfiguration,
            attributeConfiguration,
            tenantId,
            categoryId,
            isPublished,
        } = req.body;

        // Upload the image to cloud storage
        const file = req.files?.image as UploadedFile;
        if (!file) {
            return next(createHttpError(400, "Image file is required"));
        }
        const fileName = uuidv4();
        const fileData = file.data.buffer;
        await this.storage.upload({
            fileName,
            fileData,
        });

        this.logger.info("Image uploaded successfully", { fileName });

        const product = {
            name,
            description,
            image: fileName,
            priceConfiguration,
            attributeConfiguration,
            tenantId,
            categoryId,
            isPublished: isPublished === "true" ? true : false,
        };

        const createdProduct = await this.productService.createProduct(product);

        this.logger.info("Product created successfully", { createdProduct });
        // Emit a Kafka message for product creation
        const message = JSON.stringify({
            event: ProductEvents.PRODUCT_CREATE,
            data: {
                id: createdProduct._id,
                priceConfiguration: mapToObject(
                    createdProduct.priceConfiguration as Map<string, any>
                ),
            }
        })
         await this.messageProducerBroker.sendMessage(
             config.get<string>("kafka.topics.product"),
            message,
         );

        res.status(201).json({
            msg: "Product created successfully",
            _id: createdProduct._id,
        });
    };

    updateProduct = async (req: Request, res: Response, next: NextFunction) => {
        const { productId } = req.params;
        const product = await this.productService.getProductById(productId);
        if (!product) {
            return next(createHttpError(404, "Product not found"));
        }

        if (req.auth?.role !== "admin") {
            // Check if the user is authorized to update the product
            const product = await this.productService.getProductById(productId);
            const tenant = req.auth?.tenantId;
            if (tenant !== product.tenantId) {
                return next(
                    createHttpError(
                        403,
                        "You are not authorized to update this product",
                    ),
                );
            }
        }

        // Check whether image is present in the request
        let oldImage: string | undefined;
        let newImage: string | undefined;

        oldImage = await this.productService.getProductImage(productId);

        if (req.files?.image) {
            // Upload the new image to cloud storage
            const file = req.files?.image as UploadedFile;
            const fileName = uuidv4();
            const fileData = file.data.buffer;
            newImage = fileName;

            await this.storage.upload({
                fileName,
                fileData,
            });
            this.logger.info("Image uploaded successfully", { newImage });

            // Delete the old image from cloud storage
            if (oldImage) {
                await this.storage.delete(oldImage);
            }
            this.logger.info("Old image deleted successfully", { oldImage });
        }

        const {
            name,
            description,
            priceConfiguration,
            attributeConfiguration,
            tenantId,
            categoryId,
            isPublished
        } = req.body;

        const productToUpdate = {
            name,
            description,
            priceConfiguration,
            attributeConfiguration,
            image: newImage || oldImage,
            tenantId,
            categoryId,
            isPublished,
        };
        const updatedProduct = await this.productService.updateProduct(
            productId,
            productToUpdate,
        );
        this.logger.info("Product updated successfully", { updatedProduct });
        // Emit a Kafka message for product update

        const message = JSON.stringify({
            event: ProductEvents.PRODUCT_UPDATE,
            data: {
                id: updatedProduct._id,
                priceConfiguration: mapToObject(
                    updatedProduct.priceConfiguration as Map<string, any>
                ),
            }
        })

        await this.messageProducerBroker.sendMessage(
            config.get<string>("kafka.topics.product"),
            message,
        );

        res.status(200).json({
            msg: "Product updated successfully",
            _id: updatedProduct._id,
        });
    };

    getProducts = async (req: Request, res: Response, next: NextFunction) => {
        const { q, tenantId, categoryId, isPublished } = req.query;

        let filters: FilterData = {};

        if (isPublished) {
            filters.isPublished = isPublished === "true" ? true : false;
        }
        if (tenantId) {
            filters.tenantId = tenantId as string;
        }
        if (categoryId) {
            filters.categoryId = new mongoose.Types.ObjectId(
                categoryId as string,
            );
        }

        const paginateOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
            customLabels: customPaginateLabels,
        };

        const products = await this.productService.getProducts(
            q as string,
            filters,
            paginateOptions,
        );

        const finalProucts = (products.data as IProduct[]).map((product) => ({
            ...product,
            image: this.storage.getObjectUri(product.image),
        }));

        res.json({
            data: finalProucts,
            total: products.total,
            perPage: products.perPage,
            currentPage: products.currentPage,
        });
    };

    getProductById = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { productId } = req.params;
        if (!productId) {
            return next(createHttpError(400, "Product ID is required"));
        }
        const product = await this.productService.getProductById(productId);

        res.json(product);
    };

    deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
        const { productId } = req.params;
        if (!productId) {
            return next(createHttpError(400, "Product ID is required"));
        }
        const product = await this.productService.getProductById(productId);
        if (!product) {
            return next(createHttpError(404, "Product not found"));
        }
        if (req.auth?.role !== "admin") {
            const product = await this.productService.getProductById(productId);
            const tenant = req.auth?.tenantId;
            if (tenant !== product.tenantId) {
                return next(
                    createHttpError(
                        403,
                        "You are not authorized to delete this product",
                    ),
                );
            }
        }
        // Delete the product image from cloud storage
        const image = await this.productService.getProductImage(productId);
        if (image) {
            await this.storage.delete(image);
        }
        this.logger.info("Image deleted successfully", { image });

        // Delete the product from the database
        await this.productService.deleteProduct(productId);

        res.json({});
    };
}
