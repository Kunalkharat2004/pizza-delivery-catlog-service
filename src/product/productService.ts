import mongoose from "mongoose";
import productModel from "./productModel";
import { FilterData, IProduct } from "./productTypes";
import { IPaginateOptions } from "../common/types";

export class ProductService {
    createProduct = async (product: IProduct) => {
        return await productModel.create(product);
    };

    getProductImage = async (productId: string) => {
        const product = await productModel.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }
        return product.image;
    };

    updateProduct = async (productId: string, product: Partial<IProduct>) => {
        // Checks whether the product exists
        const existingProduct = await productModel.findById(productId);
        if (!existingProduct) {
            throw new Error("Product not found");
        }

        // Update the product
        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            product,
            { new: true, runValidators: true },
        );
        if (!updatedProduct) {
            throw new Error("Failed to update product");
        }
        return updatedProduct;
    };

    getProductById = async (productId: string): Promise<IProduct> => {
        // populate the categoryId field with the category name
        const product = await productModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(productId),
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                attributeConfiguration: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: "$category",
            },
        ]);
        if (!product) {
            throw new Error("Product not found");
        }
        return product[0];
    };

    getProducts = async (
        q: string,
        filtersData: FilterData,
        paginateOptions: IPaginateOptions,
    ) => {
        const searchQueryRegexp = new RegExp(q as string, "i");

        const matchedQuery = {
            ...filtersData,
            name: searchQueryRegexp,
        };

        const aggregate = productModel.aggregate([
            {
                $match: matchedQuery,
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                attributeConfiguration: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: "$category",
            },
        ]);

        const result = await productModel.aggregatePaginate(
            aggregate,
            paginateOptions,
        );
        if (!result) {
            throw new Error("No products found");
        }
        return result;
    };

    deleteProduct = async (productId: string) => {
        await productModel.findByIdAndDelete(productId);
        return; 
    }
}
