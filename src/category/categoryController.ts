import { Request, Response, NextFunction } from "express";
import { CatergoryService } from "./categoryService";
import { Logger } from "winston";
import createHttpError from "http-errors";

class CategoryController {
    constructor(
        private readonly catergoryService: CatergoryService,
        private readonly logger: Logger,
    ) {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        const { name, priceConfiguration, attributeConfiguration, hasToppings } = req.body;
        this.logger.info("Creating category", {
            name,
            priceConfiguration,
            attributeConfiguration,
        });
        const category = await this.catergoryService.createCategory({
            name,
            priceConfiguration,
            attributeConfiguration,
            hasToppings
        });
        this.logger.info("Category created successfully", { category });
        res.status(201).json({
            _id: category._id,
            message: "Category created successfully",
        });
    }

    getCategories = async (req: Request, res: Response, next: NextFunction) => {
              const sleep = (ms: number) =>
                  new Promise((resolve) => setTimeout(resolve, ms));
            //   await sleep(10000);
        const categories = await this.catergoryService.getAllCategories();
        res.json(categories);
    }

    getSingleCategory = async (req: Request, res: Response, next: NextFunction) => {
        const categoryId = req.params.id;
        if (categoryId === undefined) {
            const error = createHttpError(404, "Category doesn't exists");
            throw error;
        }

        const category =
            await this.catergoryService.getSingleCategory(categoryId);
        res.json(category);
    }

    updateCategory = async (req: Request, res: Response) => {
        const categoryId = req.params.id;
        const {
            name,
            priceConfiguration,
            attributeConfiguration,
            hasToppings,
        } = req.body;

        const updatedCategory = await this.catergoryService.updateCategory(
            categoryId,
            { name, priceConfiguration, attributeConfiguration, hasToppings },
        );

        this.logger.info(`Category with id ${categoryId} updated successfully!`,{updatedCategory});
        res.json({
            msg: "Category updated successfully!",
            updatedCategory
        })
    }

    deleteCategory = async (req: Request, res: Response) => {
        const categoryId = req.params.id;
        if (categoryId === undefined) {
            const error = createHttpError(404, "Category doesn't exists");
            throw error;
        }
        await this.catergoryService.deleteCategory(categoryId)
        res.json({});
    }
}

export default CategoryController;
