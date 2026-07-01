import { DeliveryService } from "../services/delivery.service";
import { CreateDeliveryDTO, UpdateDeliveryDtO } from "../dtos/delivery.dtos";
import { Request, Response } from "express";
import { Types } from "mongoose";

let deliveryService = new DeliveryService();

export class DeliveryController{
    async createDelivery(req:Request, res:Response){
        try {
            const orderId = req.params.orderId as unknown as Types.ObjectId;
            if(!orderId){
                return res.status(401).json(
                    { success: false, message: "Unauthorized, No user Id found" }
                );
            }
            const parsedData = CreateDeliveryDTO.safeParse(req.body);
            if(!parsedData.success){
                return res.status(400).json(
                    { success: false, message: "Invalid data", errors: parsedData.error }
                );
            }
            const deliveryData = {...parsedData.data, orderId: orderId};
            const newDelivery = await deliveryService.createDelivery(deliveryData);
            return res.status(201).json(
                { success: true, message: "Delivery created successfully", data: newDelivery }
            );

        } catch (error) {
            return res.status(500).json(
                { success: false, message: "Internal Server Error", error: error }
            );
        }
    }

    async getDeliveryById(req:Request, res:Response){
        try {
            const deliveryId = req.params.deliveryId;
            const delivery = await deliveryService.getDeliveryById(deliveryId); 
            return res.status(200).json(
                { success: true, message: "Delivery fetched successfully", data: delivery }
            );
        }
        catch (error) {
            return res.status(500).json(
                { success: false, message: "Internal Server Error", error: error }
            );
        }
    }

    async getAllDeliveriesByOrder(req:Request, res:Response){
        try {
            const orderId = req.params.orderId;
            const deliveries = await deliveryService.getAllDeliveriesByOrder(orderId); 
            return res.status(200).json(
                { success: true, message: "Deliveries fetched successfully", data: deliveries }
            );
        }
        catch (error) {
            return res.status(500).json(
                { success: false, message: "Internal Server Error", error: error }
            );
        }
    }
    async getAllDeliveriesByStatus(req:Request, res:Response){
        try {
            const orderId = req.params.orderId;
            const status = req.query.status as string;
            const deliveries = await deliveryService.getAllDeliveriesByStatus(orderId, status); 
            return res.status(200).json(
                { success: true, message: "Deliveries fetched successfully", data: deliveries }
            );
        }
        catch (error) {
            return res.status(500).json(
                { success: false, message: "Internal Server Error", error: error }
            );
        }
    }

    async getAllDeliveriesByCourierName(req:Request, res:Response){
        try {
            const orderId = req.params.orderId;
            const courierName = req.query.courierName as string;
            const deliveries = await deliveryService.getAllDeliveriesByCourierName(orderId, courierName); 
            return res.status(200).json(
                { success: true, message: "Deliveries fetched successfully", data: deliveries }
            );
        }
        catch (error) {
            return res.status(500).json(
                { success: false, message: "Internal Server Error", error: error }
            );
        }
    }

    async updateDelivery(req:Request, res:Response){
        try {
            const deliveryId =  req.params.deliveryId;
            const parsedData = UpdateDeliveryDtO.safeParse(req.body);
            if(!parsedData.success){
                return res.status(400).json(
                    { success: false, message: "Invalid data", errors: parsedData.error }
                );
            }
            const updatedDelivery = await deliveryService.updateDelivery(deliveryId, parsedData.data);
            return res.status(200).json(
                { success: true, message: "Delivery updated successfully", data: updatedDelivery }
            );
        }
        catch (error) {
            return res.status(500).json(
                { success: false, message: "Internal Server Error", error: error }
            );
        }
    }

    async deleteDelivery(req:Request, res:Response){
        try {
            const deliveryId = req.params.deliveryId;
            const isDeleted = await deliveryService.deleteDelivery(deliveryId);
            return res.status(200).json(
                { success: true, message: "Delivery deleted successfully", data: isDeleted }
            );
        }
        catch (error) {
            return res.status(500).json(
                { success: false, message: "Internal Server Error", error: error }
            );
        }
    }
}