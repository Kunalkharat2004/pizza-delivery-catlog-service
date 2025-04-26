import {Request} from "express-jwt";
import { v4 as uuidv4 } from "uuid";
import { Response } from 'express';
import { UploadedFile } from "express-fileupload";
import { FileStorage } from "../common/types/storage";
import { Logger } from "winston";
import { ToppingService } from "./toppingService";

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
} 