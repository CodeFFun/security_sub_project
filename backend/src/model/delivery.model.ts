import mongoose, { Document, Schema } from "mongoose";
import { DeliveryType } from "../types/delivery.type";

const DeliverySchema: Schema = new Schema<DeliveryType>(
    {
        status: { type: String, required: true, default: "pending" },
        courier_name: { type: String, required: true },
        tracking_id: { type: String, unique: true },
        picked_at: { type: Date },
        delivered_at: { type: Date },
        orderId: { type: mongoose.Types.ObjectId, required: true, ref: "Order" },
    },
    {
        timestamps: true,
        
    }
);

export interface IDelivery extends DeliveryType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const DeliveryModel = mongoose.model<IDelivery>("Delivery", DeliverySchema);
