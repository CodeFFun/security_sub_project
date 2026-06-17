import mongoose, { Document, Schema } from "mongoose";
import { ShopType } from "../types/shop.type";

const ShopSchema: Schema = new Schema<ShopType>(
    {
        name: { type: String, required: true },               
        pickup_info: { type: String },
        about: { type: String },
        accepts_subscription: { type: Boolean, default: false },
        addressId: { type: String, ref: "Address", required: true },
        shop_banner: { type: String },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        categoryId: { type: Schema.Types.ObjectId, ref: "ShopCategory" },
    },
    {
        timestamps: true,
    }
);

export interface IShop extends ShopType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const ShopModel = mongoose.model<IShop>("Shop", ShopSchema);
