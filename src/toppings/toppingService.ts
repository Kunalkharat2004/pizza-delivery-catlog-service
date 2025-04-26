import createHttpError from "http-errors";
import { IProduct } from "../product/productTypes";
import toppingsModel from "./toppingsModel";
import { IToppings } from "./toppingsTypes";

export class ToppingService {
    
    createTopping = async(toppings: IToppings) =>{
        return await toppingsModel.create(toppings);
    }
    getToppingImage = async(toppingId: string) => {
        const topping = await toppingsModel.findById(toppingId);
        return topping.image;
    }

    deleteTopping = async(toppingId: string )=> {
        await toppingsModel.findByIdAndDelete(toppingId);
    }
    getToppingById = async(toppingId: string)=>{
        return await toppingsModel.findById(toppingId);
    }
    updateTopping = async(toppingId:string,toppingData:Partial<IProduct>): Promise<IToppings> =>{

        const isExistingTopping = await toppingsModel.findById(toppingId);
        if(!isExistingTopping){
            const error = createHttpError(404,"Topping doesn't exist");
            throw error;
        };

        const updatedTopping = await toppingsModel.findByIdAndUpdate(toppingId,toppingData,{new: true});
        if (!updatedTopping) {
            throw new Error("Failed to update topping");
        }
        return updatedTopping;
    }
}