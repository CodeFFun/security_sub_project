import { HttpError } from "../errors/http-error";
import { ISubscriptionPlan } from "../model/subscription-plan.model";
import { SubscriptionPlanRepository } from "../repositories/subscription-plan.repository";

const subscriptionPlanRepo = new SubscriptionPlanRepository()

export class SubscriptionPlanService{
    async createSubscriptionPlan(subscriptionPlanData: Partial<ISubscriptionPlan>){
        return await subscriptionPlanRepo.createSubscriptionPlan(subscriptionPlanData);
    }
    async getSubscriptionPlanById(id: string){
        if(!id) return new HttpError(400, "Subscription Id is Required");
        return await subscriptionPlanRepo.getSubscriptionPlanById(id);
    }
    async getSubscriptionPlansByShopId(shopId: string){
        if(!shopId) return new HttpError(400, "Shop Id is Required");
        return await subscriptionPlanRepo.getSubscriptionPlansByShopId(shopId);
    }
    async getActiveSubscriptionPlansByActiveStatus(shopId: string, active: boolean){
        if(!shopId) return new HttpError(400, "Shop Id is Required");
        return await subscriptionPlanRepo.getActiveSubscriptionPlansByActiveStatus(shopId, active);
    }
    async updateSubscriptionPlan(id: string, updateData: Partial<ISubscriptionPlan>){
        if(!id) return new HttpError(400, "Subscription Id is Required");
        return await subscriptionPlanRepo.updateSubscriptionPlan(id, updateData);
    }
    async deleteSubscriptionPlan(id: string){
        if(!id) return new HttpError(400, "Subscription Id is Required");
        return await subscriptionPlanRepo.deleteSubscriptionPlan(id)
    }
}