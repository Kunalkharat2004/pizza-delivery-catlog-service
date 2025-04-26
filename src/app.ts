import express, { Request, Response } from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import categoryRoute from "./category/categoryRoute";
import cookieParser from "cookie-parser";
import productRoute from "./product/productRoute";
import toppingsRoute from "./toppings/toppingsRoute";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.json({
        message:"Hello from catlog service"
    })
});

app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);
app.use("/api/toppings", toppingsRoute);

app.use(globalErrorHandler);

export default app;
