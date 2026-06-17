import mongoose, { Document, Schema } from "mongoose";
import { ProductType } from "../types/product.type";

const ProductSchema: Schema = new Schema<ProductType>(
    {
        name: { type: String, required: true },
        description: { type: String },
        base_price: { type: Number, required: true, min: 0 },
        stock_quantity: { type: Number, required: true, min: 0, default: 0 },
        discount: { type: Number, min: 0, max: 100, default:0 },
        shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
        categoryId: [{ type: Schema.Types.ObjectId, ref: "ProductCategory" }],
    },
    {
        timestamps: true,
    }
);

export interface IProduct extends ProductType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);
