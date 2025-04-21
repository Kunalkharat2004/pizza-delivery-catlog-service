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
import { S3Storage } from "../common/services/S3Storage";
import createHttpError from "http-errors";

const router = Router();

const productService = new ProductService();
const s3Storage = new S3Storage();
const productController = new ProductController(
    productService,
    logger,
    s3Storage,
);

router.post(
    "/",
    authenticate,
    canAccess([ROLES.ADMIN]),
    fileUpload({
        limits: { fileSize: 500 * 1024 }, // 500 KB
        abortOnLimit: true,
        limitHandler: (req, res,next) => {
            return next(
                createHttpError(413, "File size limit has been reached"),
            );
        },
    }),
    productValidationRules,
    handleValidationErrors,
    asyncWrapper(productController.createProduct),
);

export default router;
