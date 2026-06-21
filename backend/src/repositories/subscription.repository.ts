import { ISubscription, SubscriptionModel } from "../model/subscription.model";

export interface ISubscriptionRepository {
    createSubscription(subscriptionData: Partial<ISubscription>): Promise<ISubscription>;
    getSubscriptionById(id: string): Promise<ISubscription | null>;
    getAllSubscriptionsOfAUser(userId:string): Promise<ISubscription[]>;
    getAllSubscriptionsOfAShop(shopId:string): Promise<ISubscription[]>;
    getSubscriptionsByStatus(userId:string, status: string): Promise<ISubscription[]>;
    updateSubscription(id: string, updateData: Partial<ISubscription>): Promise<ISubscription | null>;
    deleteSubscription(id: string): Promise<boolean>;
}

export class SubscriptionRepository implements ISubscriptionRepository {
    async createSubscription(subscriptionData: Partial<ISubscription>): Promise<ISubscription> {
        const subscription = new SubscriptionModel(subscriptionData);
        return await subscription.save();
    }

    async getSubscriptionById(id: string): Promise<ISubscription | null> {
        const subscription = await SubscriptionModel.findById(id).populate({path: 'subscription_planId', populate:{path:'productId'}}).populate("shopId").populate("userId");
        return subscription;
    }

    async getAllSubscriptionsOfAUser(userId:string): Promise<ISubscription[]> {
        const subscriptions = await SubscriptionModel.find({userId:userId}).populate({path: 'subscription_planId', populate:{path:'productId'}}).populate("shopId").populate("userId");
        return subscriptions;
    }

    async getAllSubscriptionsOfAShop(shopId:string): Promise<ISubscription[]> {
        const subscriptions = await SubscriptionModel.find({shopId:shopId}).populate({path: 'subscription_planId', populate:{path:'productId'}}).populate("shopId").populate("userId");
        return subscriptions;
    }

    async getSubscriptionsByStatus(userId:string, status: string): Promise<ISubscription[]> {
        const subscriptions = await SubscriptionModel.find({ userId: userId, status: status }).populate({path: 'subscription_planId', populate:{path:'productId'}}).populate("shopId").populate("userId");
        return subscriptions;
    }

    async updateSubscription(id: string, updateData: Partial<ISubscription>): Promise<ISubscription | null> {
        const updatedSubscription = await SubscriptionModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        return updatedSubscription;
    }

    async deleteSubscription(id: string): Promise<boolean> {
        const result = await SubscriptionModel.findByIdAndDelete(id);
        return result ? true : false;
    }
}
