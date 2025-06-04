import { Router } from "express";
import authenticate from "../common/middlewares/authenticate";
import canAccess from "../common/middlewares/canAccess";
import { asyncWrapper } from "../common/utils/wrapper";
import { ToppingsController } from "./toppingsController";
import { handleValidationErrors } from "../common/middlewares/validate-schema";
import toppingValidator from "./toppingValidator";
import fileUpload from "express-fileupload";
import createHttpError from "http-errors";
import { S3Storage } from "../common/services/S3Storage";
import logger from "../config/logger";
import { ToppingService } from "./toppingService";
import { ROLES } from "../common/constants";

const router = Router();

const s3Storage = new S3Storage();
const toppingsService = new ToppingService();
const toppingsController = new ToppingsController(toppingsService,s3Storage,logger);

// POST create topping
router.post(
    "/",
    authenticate,
    canAccess([ROLES.ADMIN, ROLES.MANAGER]),
    fileUpload({
        limits: { fileSize: 1.5 * 1024 * 1024 }, // 1.5MB
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            return next(
                createHttpError(413, "File size limit has been reached"),
            );
        },
    }),
    toppingValidator,
    handleValidationErrors,
    asyncWrapper(toppingsController.createTopping),
)

// UPDATE topping
router.patch(
    "/:toppingId",
    authenticate,
    canAccess([ROLES.ADMIN, ROLES.MANAGER]),
    fileUpload({
        limits: { fileSize: 1.5 * 1024 * 1024 }, // 1.5MB
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            return next(
                createHttpError(413, "File size limit has been reached"),
            );
        },
    }),
    toppingValidator,
    handleValidationErrors,
    asyncWrapper(toppingsController.updateTopping),
);

// GET toppings
router.get(
    "/",
    asyncWrapper(toppingsController.getToppings),
)

// GET topping by id
router.get(
    "/:toppingId",
    asyncWrapper(toppingsController.getToppingById),
)

// DELETE topping
router.delete(
    "/:toppingId",
    authenticate,
    canAccess([ROLES.ADMIN, ROLES.MANAGER]),
    asyncWrapper(toppingsController.deleteTopping),
)


export default router;