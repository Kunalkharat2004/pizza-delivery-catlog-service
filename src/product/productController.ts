import {Request} from "express-jwt";
import {NextFunction, Response} from "express";
import { Logger } from "winston";
import { UploadedFile } from "express-fileupload";
import {v4 as uuidv4} from "uuid";
import { ProductService } from "./productService";
import { FileStorage } from "../common/types/storage";
import createHttpError from "http-errors";

export class ProductController {
    constructor(
        private productService: ProductService,
        private logger: Logger,
        private storage: FileStorage
    ){};

    createProduct = async(req: Request, res: Response, next: NextFunction) =>{
        // Validate the request body
        const {name, description,image,priceConfiguration,attributeConfiguration} = req.body;

        // Upload the image to cloud storage
        const file = req.files?.image as UploadedFile;
        if (!file) {
           return next(createHttpError(400, "Image file is required"));
        }
        const fileName = uuidv4() + "-" + file.name;
        const fileData = file.data.buffer;

        await this.storage.upload({
            fileName,
            fileData
        });

        this.logger.info("Image uploaded successfully", {fileName});

        const product = {
            name,
            description,
            image: fileName,
            priceConfiguration,
            attributeConfiguration
        }
        
        const createdProduct = await this.productService.createProduct(product);

        this.logger.info("Product created successfully",{createdProduct});

        res.status(201).json({
            msg: "Product created successfully",
           _id: createdProduct._id
        })
    }

    updateProduct = async(req: Request, res: Response, next: NextFunction) =>{
        
        const {productId} = req.params;

        // Check whether image is present in the request
        let oldImage: string | undefined;
        let newImage: string | undefined;

        oldImage = await this.productService.getProductImage(productId);

        if(req.files?.image){
            
            // Upload the new image to cloud storage
            const file = req.files?.image as UploadedFile;
            const fileName = uuidv4() + "-" + file.name;
            const fileData = file.data.buffer;
            newImage = fileName;
            
            await this.storage.upload({
                fileName,
                fileData
            });
            this.logger.info("Image uploaded successfully", {newImage});
            
            // Delete the old image from cloud storage
            if(oldImage){
                await this.storage.delete(oldImage);
            }
            this.logger.info("Old image deleted successfully", {oldImage});
        }

        const {name, description, priceConfiguration, attributeConfiguration} = req.body;

        const product = {
            name,
            description,
            priceConfiguration,
            attributeConfiguration,
            image: newImage || oldImage
        }
        const updatedProduct = await this.productService.updateProduct(productId, product);
        this.logger.info("Product updated successfully",{updatedProduct});

        res.status(200).json({
            msg: "Product updated successfully",
            _id: updatedProduct._id
        })

    }
}