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
           _id: createdProduct._id
        })
    }
}