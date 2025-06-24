import mongoose from "mongoose";

export interface IProduct {
    name: string;
    description: string;
    image: string;
    priceConfiguration: string;
    attributeConfiguration: string;
    tenantId: string;
    categoryId: mongoose.Types.ObjectId;
    isPublished: boolean;
}

export interface FilterData {
    q?: string;
    tenantId?: string;
    categoryId?: mongoose.Types.ObjectId;
    isPublished?: boolean;
}

export interface ICustomPaginateLabels {
    docs: string;
    totalDocs: string;
    limit: string;
    page: string;
}

export enum ProductEvents {
    PRODUCT_CREATE = "PRODUCT_CREATE",
    PRODUCT_UPDATE = "PRODUCT_UPDATE",
    PRODUCT_DELETE = "PRODUCT_DELETE",
}