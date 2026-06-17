import mongoose, { Document, Schema } from "mongoose";
import { SubscriptionType } from "../types/subscription.type";
import { SubscriptionPlanModel } from "./subscription-plan.model";

const SubscriptionSchema: Schema = new Schema<SubscriptionType>(
    {
        status: { type: String, required: true, default:"active" },
        start_date: { type: Date, required: true },
        remaining_cycle: { type: Number, required: true, min: 1, default: 1 },
        subscription_planId: { type: Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
        paymentId: { type: Schema.Types.ObjectId, ref: "Payment"},
    },
    {
        timestamps: true,
    }
);

export interface ISubscription extends SubscriptionType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

SubscriptionSchema.pre("findOneAndDelete", async function () {
  const sub = await this.model
    .findOne(this.getFilter())
    .select("subscription_planId")
    .lean()

  if (sub?.subscription_planId) {
    await SubscriptionPlanModel.findByIdAndDelete(sub.subscription_planId)
  }
})


export const SubscriptionModel = mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
