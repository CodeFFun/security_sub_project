import mongoose, { Document, Schema } from "mongoose";
import { SubscriptionPlanType } from "../types/subscription-plan.type";

const SubscriptionPlanSchema: Schema = new Schema<SubscriptionPlanType>(
    {
        frequency: { type: Number, required: true },
        price_per_cycle: { type: Number, required: true, min: 0},
        active: { type: Boolean, default: false },
        productId: [{ type: Schema.Types.ObjectId, ref: "Product", default: [] }],
        quantity: { type: Number, min: 1, default: 1 },
    },
    {
        timestamps: true,
    }
);

export interface ISubscriptionPlan extends SubscriptionPlanType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const SubscriptionPlanModel = mongoose.model<ISubscriptionPlan>("SubscriptionPlan", SubscriptionPlanSchema);
