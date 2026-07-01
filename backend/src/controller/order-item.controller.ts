import { OrderItemService } from "../services/order-item.service";
import { CreateOrderItemDTO, UpdateOrderItemDTO } from "../dtos/order-item.dtos";
import { Request, Response } from "express";
import z from "zod";

const orderItemService = new OrderItemService();

export class OrderItemController {
    async createOrderItem(req: Request, res: Response) {
        try{
            const parsedData = CreateOrderItemDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                )
            }
            const orderItemData: Partial<CreateOrderItemDTO> = parsedData.data;
            const newOrderItem = await orderItemService.createOrderItem(orderItemData);
            return res.status(201).json(
                { success: true, message: "Order Item Created", data: newOrderItem }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getOrderItemById(req: Request, res: Response) {
        try{
            const orderItemId = req.params.id;
            const orderItem = await orderItemService.getOrderItemById(orderItemId);
            return res.status(200).json(
                { success: true, message: "Order Item retrieved", data: orderItem }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async updateOrderItem(req: Request, res: Response) {
        try{
            const orderItemId = req.params.id;
            const parsedData = UpdateOrderItemDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                )
            }
            const updateData: Partial<UpdateOrderItemDTO> = parsedData.data;
            const updatedOrderItem = await orderItemService.updateOrderItem(orderItemId, updateData);
            return res.status(200).json(
                { success: true, message: "Order Item Updated", data: updatedOrderItem }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }
    async deleteOrderItem(req: Request, res: Response) {
        try{
            const orderItemId = req.params.id;
            await orderItemService.deleteOrderItem(orderItemId);
            return res.status(200).json(
                { success: true, message: "Order Item Deleted" }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }
}