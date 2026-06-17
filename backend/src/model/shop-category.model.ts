import mongoose, { Document, Schema } from "mongoose";
import { ShopCategoryType } from "../types/shop-category.types";


const ShopCategorySchema:Schema = new Schema<ShopCategoryType>(
    {
        name: { type: String, required: true },
        description: { type: String },
    },
    {
        timestamps: true,
    }
);

export interface IShopCategory extends ShopCategoryType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const ShopCategoryModel = mongoose.model<IShopCategory>("ShopCategory", ShopCategorySchema);