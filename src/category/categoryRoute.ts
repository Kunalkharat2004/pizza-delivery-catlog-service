import express from "express";
import CategoryController from "./categoryController";
import { categoryValidator } from "./categoryValidator";
import { handleValidationErrors } from "../common/middlewares/validate-schema";
import { CatergoryService } from "./categoryService";
import logger from "../config/logger";

const router = express.Router();

const categoryService = new CatergoryService();
const categoryController = new CategoryController(categoryService, logger);

router.post(
    "/",
    categoryValidator,
    handleValidationErrors,
    categoryController.create.bind(categoryController)
);

export default router;
