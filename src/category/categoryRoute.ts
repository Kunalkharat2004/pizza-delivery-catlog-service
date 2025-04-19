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

// GET list of all categories
router.get(
    "/",
    asyncWrapper(categoryController.getCategories.bind(categoryController))
)

// GET single category by id
router.get(
    "/:id",
    asyncWrapper(categoryController.getSingleCategory.bind(categoryController))
)

// PATCH category by id
router.patch(
    "/:id",
    authenticate,
    canAccess([ROLES.ADMIN]),
    categoryValidator,
    handleValidationErrors,
    asyncWrapper(categoryController.updateCategory.bind(categoryController))
)

router.delete(
    "/:id",
    authenticate,
    canAccess([ROLES.ADMIN]),
    asyncWrapper(categoryController.deleteCategory.bind(categoryController))
)

export default router;
