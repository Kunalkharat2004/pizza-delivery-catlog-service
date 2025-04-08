import express from "express";
import CategoryController from "./categoryController";
import { categoryValidator } from "./categoryValidator";
import { handleValidationErrors } from "../common/middlewares/validate-schema";
import { CatergoryService } from "./categoryService";
import logger from "../config/logger";
import { asyncWrapper } from "../common/utils/wrapper";
import authenticate from "../common/middlewares/authenticate";
import canAccess from "../common/middlewares/canAccess";
import { ROLES } from "../common/constants";

const router = express.Router();

const categoryService = new CatergoryService();
const categoryController = new CategoryController(categoryService, logger);

router.post(
    "/",
    authenticate,
    canAccess([ROLES.ADMIN]),
    categoryValidator,
    handleValidationErrors,
    asyncWrapper(categoryController.create.bind(categoryController))
);

export default router;
