import mongoose, { Document, Schema } from "mongoose";
import { ProductCategoryType } from "../types/product-category.type";

const ProductCategorySchema:Schema = new Schema<ProductCategoryType>(
    {
        name: { type: String, required: true },
        description: { type: String },
        shopId: { type: mongoose.Types.ObjectId, ref: "Shop" },
    },
    {
        timestamps: true,
    }
);

export interface IProductCategory extends ProductCategoryType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const ProductCategoryModel = mongoose.model<IProductCategory>("ProductCategory", ProductCategorySchema);