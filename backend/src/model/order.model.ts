import mongoose, { Document, Schema } from "mongoose";
import { OrderType } from "../types/order.type";
import { OrderItemModel } from "./order-item.model";

const OrderSchema: Schema = new Schema<OrderType>(
    {
        delivery_type: { type: String, required: true, default: "standard" },
        schedule_for: { type: Date },
        subscriptionId: { type: Schema.Types.ObjectId, ref: "Subscription" },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
        orderItemsId: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
    },
    {
        timestamps: true,
    }
);

export interface IOrder extends OrderType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

OrderSchema.pre("findOneAndDelete", async function () {
  const order = await this.model
    .findOne(this.getFilter())
    .select("orderItemsId")
    .lean()

  if (order?.orderItemsId?.length) {
    await OrderItemModel.deleteMany({
      _id: { $in: order.orderItemsId }
    })
  }
})




export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);
