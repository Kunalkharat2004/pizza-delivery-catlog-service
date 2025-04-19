import createHttpError from "http-errors";
import { ICategory } from "./categoryTypes";
import Category  from "./catergoryModel";
import mongoose from "mongoose";

export class CatergoryService{

    async createCategory(category: ICategory){
            const createdCategory = new Category(category);
            return createdCategory.save();
       
    }

    async getAllCategories(){
        return await Category.find({});
    }

    async getSingleCategory(categoryId: string){

        // Check whether the categoryId is a valid MongoDB ObjectId
        if(!mongoose.Types.ObjectId.isValid(categoryId)){
            throw createHttpError(400, "Invalid category ID");
        }

        // Checks whether categoryId exists in DB
        const category = await Category.findById(categoryId);
        if(!category){
            throw createHttpError(404,"Category doesn't exists");
        }
        return category;
    }

    async updateCategory(categoryId: string, categoryData: ICategory){
          // Check whether the categoryId is a valid MongoDB ObjectId
          if(!mongoose.Types.ObjectId.isValid(categoryId)){
            throw createHttpError(400, "Invalid category ID");
        }
        // Checks whether categoryId exists in DB
        const isValidCategory = await Category.findById(categoryId);
        if(!isValidCategory){
            throw createHttpError(404,"Category doesn't exists");
        }

        const updatedCategory = await Category.findByIdAndUpdate(categoryId,categoryData,{new: true});
        return updatedCategory;
    }

    async deleteCategory(categoryId: string){
          // Check whether the categoryId is a valid MongoDB ObjectId
          if(!mongoose.Types.ObjectId.isValid(categoryId)){
            throw createHttpError(400, "Invalid category ID");
        }
        // Checks whether categoryId exists in DB
        return await Category.findByIdAndDelete(categoryId);
    }
}