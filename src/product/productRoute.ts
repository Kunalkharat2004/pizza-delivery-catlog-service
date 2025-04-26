import { Router } from "express";
import authenticate from "../common/middlewares/authenticate";
import canAccess from "../common/middlewares/canAccess";
import { ROLES } from "../common/constants";
import { handleValidationErrors } from "../common/middlewares/validate-schema";
import productValidationRules from "./validator/createProductValidator";
import { asyncWrapper } from "../common/utils/wrapper";
import { ProductController } from "./productController";
import { ProductService } from "./productService";
import fileUpload from "express-fileupload";
import logger from "../config/logger";
import { S3Storage } from "../common/services/S3Storage";
import createHttpError from "http-errors";
import updateValidationRules from "./validator/updateValidationRules";

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
    canAccess([ROLES.ADMIN,ROLES.MANAGER]),
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

router.put(
    "/:productId",
    authenticate,
    canAccess([ROLES.ADMIN, ROLES.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1024 }, // 500 KB
        abortOnLimit: true,
        limitHandler: (req, res,next) => {
            return next(
                createHttpError(413, "File size limit has been reached"),
            );
        },
    }),
    updateValidationRules,
    handleValidationErrors,
    asyncWrapper(productController.updateProduct),
);

// Get list of products
router.get(
    "/",
    asyncWrapper(productController.getProducts),
)

// GET product by id
router.get(
    "/:productId",
    asyncWrapper(productController.getProductById),
)

// DELETE product by id
router.delete(
    "/:productId",
    authenticate,
    canAccess([ROLES.ADMIN,ROLES.MANAGER]),
    asyncWrapper(productController.deleteProduct),
)

export default router;
