import mongoose from "mongoose";

export interface IProduct {
    name: string;
    description: string;
    image: string;
    priceConfiguration: string;
    attributeConfiguration: string;
}

export interface FilterData {
    q?: string;
    tenantId?: string;
    categoryId?: mongoose.Types.ObjectId;
    isPublished?: boolean;
}