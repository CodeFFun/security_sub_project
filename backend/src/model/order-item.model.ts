import mongoose, { Document, Schema } from "mongoose";
import { OrderItemType } from "../types/order-item.type";

const OrderItemSchema: Schema = new Schema<OrderItemType>(
    {
        quantity: { type: Number, required: true, min: 1 },
        unit_price: { type: Number, required: true, min: 0 },
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    },
    {
        timestamps: true,
    }
);

export interface IOrderItem extends OrderItemType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const OrderItemModel = mongoose.model<IOrderItem>("OrderItem", OrderItemSchema);
