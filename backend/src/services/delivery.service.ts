import { HttpError } from "../errors/http-error";
import { IDelivery } from "../model/delivery.model";
import { DeliveryRepository } from "../repositories/delivery.repository";

let deliveryRepository:DeliveryRepository = new DeliveryRepository();

export class DeliveryService{
    async createDelivery(deliveryData:Partial<IDelivery>){
        return await deliveryRepository.createDelivery(deliveryData);
    }
    async getDeliveryById(id:string){
        if(!id)
        {
            return new HttpError(400, "Delivery Id is Reqired")
        }
        const delivery  = await deliveryRepository.getDeliveryById(id);
        return delivery;
    }

    async getAllDeliveriesByOrder(orderId:string){
        if(!orderId) return new HttpError(400, "Order Id is Required");

        const deliveries = await deliveryRepository.getAllDeliveriesByOrder(orderId);
        return deliveries;
    }
    async getAllDeliveriesByStatus(orderId:string, status: string){
        if(!orderId) return new HttpError(400, "Order Id is Required");
        const deliveries = await deliveryRepository.getAllDeliveriesByStatus(orderId, status)
        return deliveries;
    }
    async getAllDeliveriesByCourierName(orderId:string,courierName: string){
        if(!orderId) return new HttpError(400, "Order Id is Required");
        const deliveries = await deliveryRepository.getAllDeliveriesByCourierName(orderId, courierName)
        return deliveries;
    }
    async updateDelivery(id: string, updateData: Partial<IDelivery>){
        if(!id) return new HttpError(400, "Delivery Id is Required");
        const deliveries = await deliveryRepository.updateDelivery(id, updateData);
        return deliveries;
    }
    async deleteDelivery(id: string){
        if(!id) return new HttpError(400, "Delivery Id is Required");
        const isDeleted = await deliveryRepository.deleteDelivery(id)
        return isDeleted;
    }

}