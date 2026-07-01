import { OrderService } from "../services/order.service";
import { CreateOrderDTO, UpdateOrderDTO } from "../dtos/order.dtos";
import { Request, Response } from "express";
import z from "zod";
import { Types } from "mongoose";

const orderService = new OrderService();

export class OrderController {
    async createOrder(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            const shopId = req.params.shopId;
            if (!userId) {
                return res.status(401).json(
                    { success: false, message: "Unauthorized" }
                );
            }
            if(!shopId) {
                return res.status(400).json(
                    { success: false, message: "Shop Id is Required" }
                );
            }
            const parsedData = CreateOrderDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                )
            }
            const orderData: Partial<CreateOrderDTO> = parsedData.data;
            orderData.userId = userId;
            orderData.shopId = shopId as unknown as Types.ObjectId;
            const newOrder = await orderService.createOrder(orderData);
            return res.status(201).json({
                success: true,
                message: "Order Created Successfully",
                data: newOrder,
            })
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message });
        }
    }

    async getOrderById(req: Request, res: Response) {
        try {
            const orderId = req.params.id;
            const order = await orderService.getOrderById(orderId);
            return res.status(200).json({
                success: true,
                message: "Order Retrieved Successfully",
                data: order,
            });
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message });
        }
    }
    async getOrdersByUserId(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if (!userId) {
                return res.status(401).json(
                    { success: false, message: "Unauthorized" }
                );
            }
            const orders = await orderService.getOrdersByUserId(userId);
            return res.status(200).json({
                success: true,
                message: "Orders Retrieved Successfully",
                data: orders,
            });
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message });
        }
    }

    async getOrdersByShopId(req: Request, res: Response) {
        try {
            const shopId = req.params.shopId;
            const orders = await orderService.getOrdersByShopId(shopId);
            return res.status(200).json({
                success: true,
                message: "Orders Retrieved Successfully",
                data: orders,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message });
        }
    }

    async getOrdersBySubscriptionId(req: Request, res: Response) {
        try {
            const subscriptionId = req.params.subscriptionId;
            const orders = await orderService.getOrdersBySubscriptionId(subscriptionId);
            return res.status(200).json({
                success: true,
                message: "Orders Retrieved Successfully",
                data: orders,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message });
        }
    }

    async updateOrder(req: Request, res: Response) {
        try {
            const orderId = req.params.id;
            const parsedData = UpdateOrderDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                )
            }
            const updateData: Partial<UpdateOrderDTO> = parsedData.data;
            const updatedOrder = await orderService.updateOrder(orderId, updateData);
            return res.status(200).json({
                success: true,
                message: "Order Updated Successfully",
                data: updatedOrder,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message });
        }
    }

    async deleteOrder(req: Request, res: Response) {
        try {
            const orderId = req.params.id;
            await orderService.deleteOrder(orderId);
            return res.status(200).json({
                success: true,
                message: "Order Deleted Successfully",
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message });
        }
    }
}