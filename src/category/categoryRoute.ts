import express from "express";
import { CategoryController } from "./categoryController";
import { categoryValidator } from "./categoryValidator";
import { handleValidationErrors } from "../common/middlewares/validate-schema";

const router = express.Router();

const categoryController = new CategoryController();

router.post(
    "/",
     categoryValidator,
     handleValidationErrors,
    categoryController.create
);


export default router;
