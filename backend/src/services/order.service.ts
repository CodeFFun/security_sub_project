import { HttpError } from "../errors/http-error";
import { IOrder } from "../model/order.model";
import { OrderRepository } from "../repositories/order.repository";

const orderRepository  = new OrderRepository();

export class OrderService{
    async createOrder(orderData: Partial<IOrder>){
        return await orderRepository.createOrder(orderData);
    }
    async getOrderById(id: string){
        if(!id) return new HttpError(400, "Order Id is Required");
        return await orderRepository.getOrderById(id);
    }
    async getOrdersByUserId(userId: string){
        if(!userId) return new HttpError(400, "User Id is Required");
        return await orderRepository.getOrdersByUserId(userId);
    }
    async getOrdersByShopId(shopId: string){
        if(!shopId) return new HttpError(400, "Shop Id is Required");
        return await orderRepository.getOrdersByShopId(shopId);
    }
    async getOrdersBySubscriptionId(subscriptionId: string){
        if(!subscriptionId) return new HttpError(400, "Subscription Id is Required");
        return await orderRepository.getOrdersBySubscriptionId(subscriptionId);
    }
    async updateOrder(id: string, updateData: Partial<IOrder>){
        if(!id) return new HttpError(400, "Order Id is Required");
        return await orderRepository.updateOrder(id, updateData);
    }
    async deleteOrder(id: string){
        if(!id) return new HttpError(400, "Order Id is Required");
        return await orderRepository.deleteOrder(id);
    }
}