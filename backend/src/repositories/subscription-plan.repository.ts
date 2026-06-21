import { ISubscriptionPlan, SubscriptionPlanModel } from "../model/subscription-plan.model";

export interface ISubscriptionPlanRepository {
    createSubscriptionPlan(subscriptionPlanData: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan>;
    getSubscriptionPlanById(id: string): Promise<ISubscriptionPlan | null>;
    getSubscriptionPlansByShopId(shopId: string): Promise<ISubscriptionPlan[]>;
    getActiveSubscriptionPlansByActiveStatus(shopId: string, active:boolean): Promise<ISubscriptionPlan[]>;
    updateSubscriptionPlan(id: string, updateData: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan | null>;
    deleteSubscriptionPlan(id: string): Promise<boolean>;
}

export class SubscriptionPlanRepository implements ISubscriptionPlanRepository {
    async createSubscriptionPlan(subscriptionPlanData: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan> {
        const subscriptionPlan = new SubscriptionPlanModel(subscriptionPlanData);
        return await subscriptionPlan.save();
    }

    async getSubscriptionPlanById(id: string): Promise<ISubscriptionPlan | null> {
        const subscriptionPlan = await SubscriptionPlanModel.findById(id);
        return subscriptionPlan;
    }


    async getSubscriptionPlansByShopId(shopId: string): Promise<ISubscriptionPlan[]> {
        const subscriptionPlans = await SubscriptionPlanModel.find({ shopId: shopId });
        return subscriptionPlans;
    }

    async getActiveSubscriptionPlansByActiveStatus(shopId: string, active: boolean): Promise<ISubscriptionPlan[]> {
        const subscriptionPlans = await SubscriptionPlanModel.find({ shopId: shopId, active: active });
        return subscriptionPlans;
    }

    async updateSubscriptionPlan(id: string, updateData: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan | null> {
        const updatedSubscriptionPlan = await SubscriptionPlanModel.findByIdAndUpdate(
            { _id: id },
            updateData,
            { new: true }
        );
        return updatedSubscriptionPlan;
    }

    async deleteSubscriptionPlan(id: string): Promise<boolean> {
        const result = await SubscriptionPlanModel.findByIdAndDelete(id);
        return result ? true : false;
    }
}
