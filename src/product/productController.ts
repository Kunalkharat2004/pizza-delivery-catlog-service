import {Request} from "express-jwt";
import {Response} from "express";
import { ProductService } from "./productService";
import { Logger } from "winston";

export class ProductController {
    constructor(
        private productService: ProductService,
        private logger: Logger
    ){};

    createProduct = async(req: Request, res: Response) =>{
        const {name, description,image,priceConfiguration,attributeConfiguration} = req.body;
        const product = {
            name,
            description,
            image,
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