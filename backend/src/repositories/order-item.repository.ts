import { IOrderItem, OrderItemModel } from "../model/order-item.model";

export interface IOrderItemRepository {
    createOrderItem(orderItemData: Partial<IOrderItem>): Promise<IOrderItem>;
    getOrderItemById(id: string): Promise<IOrderItem | null>;
    
    updateOrderItem(id: string, updateData: Partial<IOrderItem>): Promise<IOrderItem | null>;
    deleteOrderItem(id: string): Promise<boolean>;
}

export class OrderItemRepository implements IOrderItemRepository {
    async createOrderItem(orderItemData: Partial<IOrderItem>): Promise<IOrderItem> {
        const orderItem = new OrderItemModel(orderItemData);
        return await orderItem.save();
    }

    async getOrderItemById(id: string): Promise<IOrderItem | null> {
        const orderItem = await OrderItemModel.findById(id);
        return orderItem;
    }

    async updateOrderItem(id: string, updateData: Partial<IOrderItem>): Promise<IOrderItem | null> {
        const updatedOrderItem = await OrderItemModel.findByIdAndUpdate(
            id,
            updateData,
        );
        return updatedOrderItem;
    }

    async deleteOrderItem(id: string): Promise<boolean> {
        const result = await OrderItemModel.findByIdAndDelete(id);
        return result ? true : false;
    }
}
