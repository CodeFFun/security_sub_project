import { IOrder, OrderModel } from "../model/order.model";

export interface IOrderRepository {
    createOrder(orderData: Partial<IOrder>): Promise<IOrder>;
    getOrderById(id: string): Promise<IOrder | null>;
    getOrdersByUserId(userId: string): Promise<IOrder[]>;
    getOrdersByShopId(shopId: string): Promise<IOrder[]>;
    getOrdersBySubscriptionId(subscriptionId: string): Promise<IOrder[]>;
    updateOrder(id: string, updateData: Partial<IOrder>): Promise<IOrder | null>;
    deleteOrder(id: string): Promise<boolean>;
}

export class OrderRepository implements IOrderRepository {
    async createOrder(orderData: Partial<IOrder>): Promise<IOrder> {
        const order = new OrderModel(orderData);
        return await order.save();
    }

    async getOrderById(id: string): Promise<IOrder | null> {
        const order = await OrderModel.findById(id).populate({path: 'orderItemsId', populate:{path:'productId'}}).populate("subscriptionId").populate("shopId").populate("userId");
        return order;
    }

    async getOrdersByUserId(userId: string): Promise<IOrder[]> {
        const orders = await OrderModel.find({ userId: userId }).populate({path: 'orderItemsId', populate:{path:'productId'}}).populate("subscriptionId").populate("shopId").populate("userId");
        return orders;
    }

    async getOrdersByShopId(shopId: string): Promise<IOrder[]> {
        const orders = await OrderModel.find({ shopId: shopId }).populate({path: 'orderItemsId', populate:{path:'productId'}}).populate("subscriptionId").populate("shopId").populate("userId");
        return orders;
    }

    async getOrdersBySubscriptionId(subscriptionId: string): Promise<IOrder[]> {
        const orders = await OrderModel.find({ subscriptionId: subscriptionId }).populate({path: 'orderItemsId', populate:{path:'productId'}}).populate("subscriptionId").populate("shopId").populate("userId");
        return orders;
    }

    async updateOrder(id: string, updateData: Partial<IOrder>): Promise<IOrder | null> {
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, populate: "orderItemsId" }
        );
        return updatedOrder;
    }

    async deleteOrder(id: string): Promise<boolean> {
        const result = await OrderModel.findByIdAndDelete(id);
        return result ? true : false;
    }
}
