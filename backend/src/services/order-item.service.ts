import { HttpError } from "../errors/http-error";
import { IOrderItem } from "../model/order-item.model";
import { OrderItemRepository } from "../repositories/order-item.repository";

const orderItemRepo = new OrderItemRepository();

export class OrderItemService {
    async createOrderItem(orderItemData: Partial<IOrderItem>){
        return await orderItemRepo.createOrderItem(orderItemData);
    }
    async getOrderItemById(id: string){
        if(!id){
            return new HttpError(400, "Order Item Id is Reqired")
        }
        return await orderItemRepo.getOrderItemById(id);
    }
    async updateOrderItem(id: string, updateData: Partial<IOrderItem>){
        if(!id){
            return new HttpError(400, "Order Item Id is Reqired")
        }
        return await orderItemRepo.updateOrderItem(id, updateData);
    }
    async deleteOrderItem(id: string){
        if(!id){
            return new HttpError(400, "Order Item Id is Reqired")
        }
        return await orderItemRepo.deleteOrderItem(id)
    }
}