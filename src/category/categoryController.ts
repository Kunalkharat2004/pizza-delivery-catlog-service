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
     try{
        const {name, priceConfiguration, attributeConfiguration} = req.body;
        this.logger.info("Creating category", {name, priceConfiguration, attributeConfiguration});
        const category = await this.catergoryService.createCategory({name, priceConfiguration, attributeConfiguration});
        this.logger.info("Category created successfully", {category});
        res.status(201).json({
            _id: category._id,
            message: "Category created successfully"
        });
     }catch(err){
        if(err instanceof Error){
            next(createHttpError(500, err.message));
            return;
        }else{
            next(createHttpError(500, "Failed to create category"));
            return;
        }
     }
    }
}

export default CategoryController;