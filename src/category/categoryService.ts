import { ICategory } from "./categoryTypes";
import CategoryModel  from "./catergoryModel";

export class CatergoryService{

    async createCategory(category: ICategory){
            const createdCategory = new CategoryModel(category);
            return createdCategory.save();
       
    }
}