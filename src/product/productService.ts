import productModel from "./productModel"
import { IProduct } from "./productTypes";

export class ProductService {
    
    createProduct = async (product: IProduct) =>{
        return await productModel.create(product);
    }

    getProductImage = async(productId: string) =>{
        const product = await productModel.findById(productId);
        if(!product){
            throw new Error("Product not found");
        }
        return product.image;
    }

    updateProduct = async(productId: string, product: Partial<IProduct>) =>{

        // Checks whether the product exists
        const existingProduct = await productModel.findById(productId);
        if(!existingProduct){
            throw new Error("Product not found");
        }

        // Update the product
        const updatedProduct = await productModel.findByIdAndUpdate(productId, product, {new: true});
        if(!updatedProduct){
            throw new Error("Failed to update product");
        }
        return updatedProduct;
    }
}