import { Request } from "express-jwt";
import { v4 as uuidv4 } from "uuid";
import { NextFunction, Response } from "express";
import { UploadedFile } from "express-fileupload";
import createHttpError from "http-errors";
import config from "config";
import { FileStorage } from "../common/types/storage";
import { Logger } from "winston";
import { ToppingService } from "./toppingService";
import { IToppings, ToppingEvents, ToppingFilters } from "./toppingsTypes";
import { customPaginateLabels } from "../config/customPaginateLabels";
import { MessageProducerBroker } from "../common/types/brokers";


export class ToppingsController {
    constructor(
        private toppingService: ToppingService,
        private storage: FileStorage,
        private logger: Logger,
        private messageProducerBroker: MessageProducerBroker,
    ) {}

    createTopping = async (req: Request, res: Response) => {
        const { name, image, price, tenantId, isPublished } = req.body;

        // Upload the topping image to cloud storage
        const file = req.files?.image as UploadedFile;
        const fileName = uuidv4();
        const fileData = file.data.buffer;

        await this.storage.upload({
            fileName,
            fileData,
        });

        this.logger.info("Image uploaded successfully", { fileName });

        const topping = {
            name,
            image: fileName,
            price,
            tenantId,
            isPublished: isPublished === "true" ? true : false,
        };

        const createdTopping = await this.toppingService.createTopping(topping);

        this.logger.info("Topping created successfully", { createdTopping });
        // Publish a message to the broker
        const message = JSON.stringify({
            event: ToppingEvents.TOPPING_CREATE,
            data: {
                id: createdTopping._id,
                price: createdTopping.price,
            }
        });
        await this.messageProducerBroker.sendMessage(
            config.get("kafka.topics.topping"),
            message,
        )

        res.status(201).json({
            msg: "Topping created successfully",
            _id: createdTopping._id,
        });
    };

    updateTopping = async (req: Request, res: Response, next: NextFunction) => {
        const { toppingId } = req.params;

        const toppingExists =
            await this.toppingService.getToppingById(toppingId);
        if (!toppingExists) {
            return next(createHttpError(404, "Topping not found"));
        }

        if (req.auth?.role !== "admin") {
            const topping = await this.toppingService.getToppingById(toppingId);
            const tenant = req.auth?.tenantId;
            if (tenant !== topping.tenantId) {
                return next(
                    createHttpError(
                        403,
                        "You are not authorized to update this topping",
                    ),
                );
            }
        }
        const { name, image, price, tenantId, isPublished } = req.body;

        let oldImage: string | undefined;
        let newImage: string | undefined;

        oldImage = await this.toppingService.getToppingImage(toppingId);

        if (req.files?.image) {
            const file = req.files?.image as UploadedFile;
            const fileName = uuidv4();
            newImage = fileName;
            const fileData = file.data.buffer;

            // Upload the new image to cloud storage
            await this.storage.upload({
                fileName,
                fileData,
            });
            this.logger.info("Image uploaded successfully");

            // Delete the old Image from cloud Storage
            if (oldImage) {
                await this.storage.delete(oldImage);
            }
            this.logger.info("Old image deleted successfull from cloud");
        }

        const topping = {
            name,
            image: newImage ?? oldImage,
            price,
            tenantId,
            isPublished: isPublished === "true" ? true : false,
        };

        const updatedTopping = await this.toppingService.updateTopping(
            toppingId,
            topping,
        );

        this.logger.info(`Topping updated successfully: ${updatedTopping._id}`);

        // Publish a message to the broker
        const message = JSON.stringify({
            event: ToppingEvents.TOPPING_UPDATE,
            data: {
                id: updatedTopping._id,
                price: updatedTopping.price,
            },
        });
        await this.messageProducerBroker.sendMessage(
            config.get("kafka.topics.topping"),
            message,
        );

        res.json({
            msg: "Topping updated successfully",
            _id: updatedTopping._id,
        });
    };

    getToppings = async (req: Request, res: Response) => {
        const sleep = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));
        // await sleep(10000);
        const { q, tenantId, isPublished, page, limit } = req.query;
        const filters: ToppingFilters = {};

        if (isPublished) {
            filters.isPublished = isPublished === "true" ? true : false;
        }
        if (tenantId) {
            filters.tenantId = tenantId as string;
        }
        const paginateOptions = {
            page: req.query.page ? parseInt(page as string) : 1,
            limit: req.query.limit ? parseInt(limit as string) : 10,
            customLabels: customPaginateLabels,
        };

        const toppings = await this.toppingService.getToppings(
            q as string,
            filters,
            paginateOptions,
        );
        const finalToppings = (toppings.data as IToppings[]).map((topping) => ({
            ...topping,
            image: this.storage.getObjectUri(topping.image),
        }));

        res.json({
            data: finalToppings,
            total: toppings.total,
            perPage: toppings.perPage,
            currentPage: toppings.currentPage,
        });
    };

    getToppingById = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { toppingId } = req.params;
        const topping = await this.toppingService.getToppingById(toppingId);

        if (!topping) {
            return next(createHttpError(404, "Topping not found"));
        }

        res.json(topping);
    };

    deleteTopping = async (req: Request, res: Response, next: NextFunction) => {
        const { toppingId } = req.params;
        const topping = await this.toppingService.getToppingById(toppingId);
        if (!topping) {
            return next(createHttpError(404, "Topping not found"));
        }
        if (req.auth?.role !== "admin") {
            const tenant = req.auth?.tenantId;
            if (tenant !== topping.tenantId) {
                return next(
                    createHttpError(
                        403,
                        "You are not authorized to delete this topping",
                    ),
                );
            }
        }

        // delete the topping image from cloud storage
        const image = await this.toppingService.getToppingImage(toppingId);
        if (image) {
            await this.storage.delete(image);
        }
        this.logger.info("Topping image deleted successfully");

        await this.toppingService.deleteTopping(toppingId);


        this.logger.info("Topping deleted successfully");

         // Publish a message to the broker
        const message = JSON.stringify({
            event: ToppingEvents.TOPPING_DELETE,
            data: {
                id: toppingId,
            },
        });
        await this.messageProducerBroker.sendMessage(
            config.get("kafka.topics.topping"),
            message,
        );

        res.json({});
    };
}
