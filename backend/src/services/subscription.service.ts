import { HttpError } from "../errors/http-error";
import { ISubscription } from "../model/subscription.model";
import { SubscriptionRepository } from "../repositories/subscription.repository";

const subscriptionRepo = new SubscriptionRepository();

export class SubscriptionService{
    async createSubscription(subscriptionData: Partial<ISubscription>){
        return await subscriptionRepo.createSubscription(subscriptionData);
    }
    async getSubscriptionById(id: string){
        if(!id) return new HttpError(400, "Subscription Id is Required");
        return await subscriptionRepo.getSubscriptionById(id);
    }
    async getAllSubscriptionsOfAUser(userId:string){
        if(!userId) return new HttpError(400, "User Id is Required");
        return await subscriptionRepo.getAllSubscriptionsOfAUser(userId);
        
    }
    async getSubscriptionsByStatus(userId:string, status: string){
        if(!userId) return new HttpError(400, "Subscription Id is Required");
        return await subscriptionRepo.getSubscriptionsByStatus(userId, status)

    }
    async getAllSubscriptionsOfAShop(shopId:string){
        if(!shopId) return new HttpError(400, "Shop Id is Required");
        return await subscriptionRepo.getAllSubscriptionsOfAShop(shopId);
    }
    async updateSubscription(id: string, updateData: Partial<ISubscription>){
        if(!id) return new HttpError(400, "Subscription Id is Required");
        return await subscriptionRepo.updateSubscription(id, updateData)
    }
    async deleteSubscription(id: string){
        if(!id) return new HttpError(400, "Subscription Id is Required");
        return subscriptionRepo.deleteSubscription(id);
    }
}