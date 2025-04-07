import { ICategory } from "./categoryTypes";
import CategoryModel  from "./catergoryModel";

export class CatergoryService{

    async createCategory(category: ICategory){
        try{
            const createdCategory = new CategoryModel(category);
            return createdCategory.save();
        }catch(err){
            throw new Error("Failed to create category");
        }
    }
}