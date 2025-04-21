import { Router } from "express";
import authenticate from "../common/middlewares/authenticate";
import canAccess from "../common/middlewares/canAccess";
import { ROLES } from "../common/constants";
import { handleValidationErrors } from "../common/middlewares/validate-schema";
import productValidationRules from "./createProductValidator";
import { asyncWrapper } from "../common/utils/wrapper";
import { ProductController } from "./productController";
import { ProductService } from "./productService";
import fileUpload from "express-fileupload";
import logger from "../config/logger";

const router = Router();

const productService = new ProductService();
const productController = new ProductController(productService,logger);

router.post(
    "/",
    authenticate,
    canAccess([ROLES.ADMIN]),
    fileUpload(),
    productValidationRules,
    handleValidationErrors,
    asyncWrapper(productController.createProduct)
);

export default router;
