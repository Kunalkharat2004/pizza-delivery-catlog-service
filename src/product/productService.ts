import productModel from "./productModel"
import { IProduct } from "./productTypes";

export class ProductService {
    
    createProduct = async (product: IProduct) =>{
        return await productModel.create(product);
    }
}