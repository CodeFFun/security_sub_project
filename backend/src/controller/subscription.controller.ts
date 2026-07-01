import { SubscriptionService } from "../services/subscription.service";
import { CreateSubscriptionDTO, UpdateSubscriptionDTO } from "../dtos/subscription.dtos";
import { Request, Response } from "express";
import z from "zod";

const subscriptionService = new SubscriptionService();

export class SubscriptionController {
    async createSubscription(req:Request, res:Response){
        try{
            const userId = req.user?._id;
            const shopId = req.params.shopId
            if(!userId){
                return res.status(401).json(
                    { success: false, message: "Unauthorized" }
                );
            }
            if(!shopId){
                return res.status(400).json(
                    { success: false, message: "Shop Id is Required" }
                );
            }
            const parsedData = CreateSubscriptionDTO.safeParse(req.body);
            if(!parsedData.success){
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                )
            }
            const subscriptionData: Partial<CreateSubscriptionDTO> = {...parsedData.data, userId: userId, shopId: shopId as any};
            const newSubscription = await subscriptionService.createSubscription(subscriptionData);
            return res.status(201).json(
                { success: true, message: "Subscription Created", data: newSubscription }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getSubscriptionById(req:Request, res:Response){
        try{
            const subscriptionId = req.params.id;
            const subscription = await subscriptionService.getSubscriptionById(subscriptionId);
            return res.status(200).json(
                { success: true, message: "Subscription retrieved", data: subscription }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getAllSubscriptionsOfAUser(req:Request, res:Response){
        try{
            const userId = req.user?._id;
            if(!userId){
                return res.status(401).json(
                    { success: false, message: "Unauthorized" }
                );
            }
            const subscriptions = await subscriptionService.getAllSubscriptionsOfAUser(userId);
            return res.status(200).json(
                { success: true, message: "Subscriptions retrieved", data: subscriptions }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getSubscriptionsByStatus(req:Request, res:Response){
        try{
            const userId = req.user?._id;
            const status = req.query.status as string;
            if(!userId){
                return res.status(401).json(
                    { success: false, message: "Unauthorized" }
                );
            }
            const subscriptions = await subscriptionService.getSubscriptionsByStatus(userId, status);
            return res.status(200).json(
                { success: true, message: "Subscriptions retrieved", data: subscriptions }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getAllSubscriptionsOfAShop(req:Request, res:Response){
        try{
            const shopId = req.params.shopId;
            if(!shopId){
                return res.status(400).json(
                    { success: false, message: "Shop Id is Required" }
                );
            }
            const subscriptions = await subscriptionService.getAllSubscriptionsOfAShop(shopId);
            return res.status(200).json(
                { success: true, message: "Subscriptions retrieved", data: subscriptions }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async updateSubscription(req:Request, res:Response){
        try{
            const subscriptionId = req.params.id;
            const parsedData = UpdateSubscriptionDTO.safeParse(req.body);
            if(!parsedData.success){
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                )
            }
            const updateData: Partial<UpdateSubscriptionDTO> = parsedData.data;
            const updatedSubscription = await subscriptionService.updateSubscription(subscriptionId, updateData);
            return res.status(200).json(
                { success: true, message: "Subscription updated", data: updatedSubscription }
            );
        }
        catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async deleteSubscription(req:Request, res:Response){
        try{
            const subscriptionId = req.params.id;
            await subscriptionService.deleteSubscription(subscriptionId);
            return res.status(200).json(
                { success: true, message: "Subscription deleted" }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }
}