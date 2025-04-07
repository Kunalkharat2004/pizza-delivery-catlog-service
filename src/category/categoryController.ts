import { Request, Response, NextFunction } from "express";
import { CatergoryService } from "./categoryService";
import { Logger } from "winston";
import createHttpError from "http-errors";

class CategoryController {

    constructor(
        private readonly  catergoryService: CatergoryService,
        private readonly logger: Logger
    ){}
    
    async create(req: Request, res: Response, next: NextFunction) {

        const {name, priceConfiguration, attributeConfiguration} = req.body;
        this.logger.info("Creating category", {name, priceConfiguration, attributeConfiguration});
        const category = await this.catergoryService.createCategory({name, priceConfiguration, attributeConfiguration});
        this.logger.info("Category created successfully", {category});
        res.status(201).json({
            _id: category._id,
            message: "Category created successfully"
        });
    }
}

export default CategoryController;