import { Request, Response, NextFunction } from "express";
import { CatergoryService } from "./categoryService";
import { Logger } from "winston";
import createHttpError from "http-errors";

class CategoryController {
    constructor(
        private readonly catergoryService: CatergoryService,
        private readonly logger: Logger,
    ) {}

    async create(req: Request, res: Response, next: NextFunction) {
        const { name, priceConfiguration, attributeConfiguration } = req.body;
        this.logger.info("Creating category", {
            name,
            priceConfiguration,
            attributeConfiguration,
        });
        const category = await this.catergoryService.createCategory({
            name,
            priceConfiguration,
            attributeConfiguration,
        });
        this.logger.info("Category created successfully", { category });
        res.status(201).json({
            _id: category._id,
            message: "Category created successfully",
        });
    }

    async getCategories(req: Request, res: Response, next: NextFunction) {
        const categories = await this.catergoryService.getAllCategories();
        res.json(categories);
    }

    async getSingleCategory(req: Request, res: Response, next: NextFunction) {
        const categoryId = req.params.id;
        if (categoryId === undefined) {
            const error = createHttpError(404, "Category doesn't exists");
            throw error;
        }

        const category =
            await this.catergoryService.getSingleCategory(categoryId);
        res.json(category);
    }

    async updateCategory(req: Request, res: Response) {
        const categoryId = req.params.id;
        const { name, priceConfiguration, attributeConfiguration } = req.body;

        const updatedCategory = await this.catergoryService.updateCategory(
            categoryId,
            { name, priceConfiguration, attributeConfiguration },
        );

        this.logger.info(`Category with id ${categoryId} updated successfully!`,{updatedCategory});
        res.json({
            msg: "Category updated successfully!",
            updatedCategory
        })
    }
}

export default CategoryController;
