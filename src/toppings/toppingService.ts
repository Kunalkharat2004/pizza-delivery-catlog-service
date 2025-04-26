import toppingsModel from "./toppingsModel";
import { IToppings } from "./toppingsTypes";

export class ToppingService {
    
    createTopping = async(toppings: IToppings) =>{
        return await toppingsModel.create(toppings);
    }
    
}