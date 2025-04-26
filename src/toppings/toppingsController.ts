import {Request} from "express-jwt";
import { v4 as uuidv4 } from "uuid";
import { NextFunction, Response } from 'express';
import { UploadedFile } from "express-fileupload";
import { FileStorage } from "../common/types/storage";
import { Logger } from "winston";
import { ToppingService } from "./toppingService";
import createHttpError from "http-errors";

export class ToppingsController {
    constructor(
        private toppingService: ToppingService,
        private storage: FileStorage,
        private logger: Logger
    ){}

    createTopping = async(req: Request, res: Response) => {

        const {name,image,price,tenantId,isPublished} = req.body;

        // Upload the topping image to cloud storage
        const file = req.files?.image as UploadedFile;
        const fileName = uuidv4();
        const fileData = file.data.buffer;

        await this.storage.upload({
            fileName,
            fileData,
        })

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
        res.status(201).json({
            msg: "Topping created successfully",
            _id: createdTopping._id,
        });
    }

    updateTopping = async(req: Request, res: Response, next: NextFunction) => {

        const {toppingId} = req.params;
        if(req.auth?.role !== "admin"){

            const topping = await this.toppingService.getToppingById(toppingId);
            const tenant = req.auth?.tenantId;
            if(tenant !== topping.tenantId){
                return next(createHttpError(
                    403,
                    "You are not authorized to update this topping",
                ));
            }
        }
        const {name,image,price,tenantId,isPublished} = req.body;

        let oldImage: string | undefined; 
        let newImage: string | undefined; 

        oldImage = await this.toppingService.getToppingImage(toppingId);

        if(req.files?.image){
            const file = req.files?.image as UploadedFile;
            const fileName = uuidv4();
            newImage = fileName;
            const fileData = file.data.buffer;

            // Upload the new image to cloud storage
            await this.storage.upload({
                fileName,
                fileData
            })
            this.logger.info("Image uploaded successfully");

            // Delete the old Image from cloud Storage
            if(oldImage){
                await this.storage.delete(oldImage);
            }
            this.logger.info("Old image deleted successfull from cloud");
        }

        const topping = {
            name,
            image: newImage ?? oldImage,
            price,
            tenantId,
            isPublished: isPublished === "true"? true: false
        }

        const updatedTopping = await this.toppingService.updateTopping(toppingId,topping);

        this.logger.info(`Topping updated successfully: ${updatedTopping._id}`);

        res.json({
            msg:"Topping updated successfully",
            _id: updatedTopping._id
        })
    }
} 