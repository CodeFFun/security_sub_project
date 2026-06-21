import { IDelivery, DeliveryModel } from "../model/delivery.model";

export interface IDeliveryRepository {
    getDeliveryById(id: string): Promise<IDelivery | null>;
    createDelivery(deliveryData: Partial<IDelivery>): Promise<IDelivery>;
    getAllDeliveriesByOrder(orderId:string): Promise<IDelivery[]>;
    getAllDeliveriesByStatus(orderId:string, status: string): Promise<IDelivery[]>;
    getAllDeliveriesByCourierName(orderId:string,courierName: string): Promise<IDelivery[]>;
    updateDelivery(id: string, updateData: Partial<IDelivery>): Promise<IDelivery | null>;
    deleteDelivery(id: string): Promise<boolean>;
}

export class DeliveryRepository implements IDeliveryRepository {
    async getDeliveryById(id: string): Promise<IDelivery | null> {
        return await DeliveryModel.findById(id);
    }
    async createDelivery(deliveryData: Partial<IDelivery>): Promise<IDelivery> {
        return await DeliveryModel.create(deliveryData);
    }
    async getAllDeliveriesByOrder(orderId:string): Promise<IDelivery[]> {
        return await DeliveryModel.find({orderId});
    }
    async getAllDeliveriesByStatus(orderId:string, status: string): Promise<IDelivery[]> {
        return await DeliveryModel.find({ orderId, status });
    }
    async getAllDeliveriesByCourierName(orderId:string,courierName: string): Promise<IDelivery[]> {
        return await DeliveryModel.find({ orderId, courier_name: courierName });
    }
    async updateDelivery(id: string, updateData: Partial<IDelivery>): Promise<IDelivery | null> {
        return await DeliveryModel.findByIdAndUpdate({ _id: id, orderId: updateData.orderId }, updateData, { new: true });
    }
    async deleteDelivery(id: string): Promise<boolean> {
        const result = await DeliveryModel.deleteOne({ _id: id });
        return result.deletedCount > 0;
    }
}