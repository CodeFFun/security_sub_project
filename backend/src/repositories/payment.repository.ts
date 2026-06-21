import { IPayment, PaymentModel } from "../model/payment.model";
import { OrderModel } from "../model/order.model";
import { ShopModel } from "../model/shop.model";

export interface IPaymentRepository {
    createPayment(paymentData: Partial<IPayment>): Promise<IPayment>;
    getPaymentById(id: string): Promise<IPayment | null>;
    getPaymentsByStatus(orderId:string, status: string): Promise<IPayment[]>;
    getPaymentsByProvider(orderId:string, provider: string): Promise<IPayment[]>;
    getPaymentsByOrderId(orderId: string): Promise<IPayment[]>;
    getPaymentsByUserId(userId: string): Promise<IPayment[]>; 
    getPaymentsOfShop(userId: string): Promise<IPayment[]>;
    updatePayment(id: string, updateData: Partial<IPayment>): Promise<IPayment | null>;
    updatePaymentByOrderId(orderId: string, updateData: Partial<IPayment>): Promise<IPayment | null>;
    deletePayment(id: string): Promise<boolean>;
}

export class PaymentRepository implements IPaymentRepository {
    async getPaymentsByOrderId(orderId: string): Promise<IPayment[]> {
        return await PaymentModel.find({ orderId: orderId }).exec();
    }
    async createPayment(paymentData: Partial<IPayment>): Promise<IPayment> {
        const payment = new PaymentModel(paymentData);
        return await payment.save();
    }

    async getPaymentById(id: string): Promise<IPayment | null> {
        const payment = await PaymentModel.findById(id).populate({
            path: "orderId",
            model: "Order",
            populate: [
                {
                    path: "orderItemsId",
                    model: "OrderItem",
                    populate: {
                        path: "productId",
                        model: "Product",
                    },
                },
                {
                    path: "shopId",
                    model: "Shop",
                },
                {
                    path: "userId",
                    model: "User",
                },
                {
                    path: "subscriptionId",
                    model: "Subscription",
                    populate: {
                        path: "subscription_planId",
                        model: "SubscriptionPlan",
                        populate: {
                            path: "productId",
                            model: "Product",
                        },
                    },
                },
            ],
        });
        return payment;
    }

    async getPaymentsByUserId(userId: string): Promise<IPayment[]> {
        const orders = await OrderModel.find({ userId }).select("_id").lean();
        const orderIds = orders.map((order) => order._id);

        if (orderIds.length === 0) {
            return [];
        }

        const payments = await PaymentModel.find({ orderId: { $in: orderIds } })
            .populate({
                path: "orderId",
                model: "Order",
                populate: [
                    {
                        path: "orderItemsId",
                        model: "OrderItem",
                        populate: {
                            path: "productId",
                            model: "Product",
                        },
                    },
                    {
                        path: "shopId",
                        model: "Shop",
                    },
                    {
                        path: "userId",
                        model: "User",
                    },
                    {
                        path: "subscriptionId",
                        model: "Subscription",
                        populate: {
                            path: "subscription_planId",
                            model: "SubscriptionPlan",
                            populate: {
                                path: "productId",
                                model: "Product",
                            },
                        },
                    },
                ],
            })
            .exec();
        return payments;
    }

    async getPaymentsOfShop(userId: string): Promise<IPayment[]> {
        const shops = await ShopModel.find({ userId: userId }).select("_id").lean();
        const shopIds = shops.map((shop) => shop._id);

        if (shopIds.length === 0) {
            return [];
        }

        const orders = await OrderModel.find({ shopId: { $in: shopIds } }).select("_id").lean();
        const orderIds = orders.map((order) => order._id);

        if (orderIds.length === 0) {
            return [];
        }

        const payments = await PaymentModel.find({ orderId: { $in: orderIds } })
            .populate({
                path: "orderId",
                model: "Order",
                match: { shopId: { $in: shopIds } },
                populate: [
                    {
                        path: "orderItemsId",
                        model: "OrderItem",
                        populate: {
                            path: "productId",
                            model: "Product",
                        },
                    },
                    {
                        path: "shopId",
                        model: "Shop",
                        populate:{
                            path:"addressId",
                            model:"Address",
                        }
                    },
                    {
                        path: "userId",
                        model: "User",
                    },
                    {
                        path: "subscriptionId",
                        model: "Subscription",
                        populate: {
                            path: "subscription_planId",
                            model: "SubscriptionPlan",
                            populate: {
                                path: "productId",
                                model: "Product",
                            },
                        },
                    },
                ],
            })
            .exec();
        const filteredPayments = payments.filter((payment) => {
            const populatedOrders = payment.orderId as unknown as Array<{ _id: unknown }>;
            return Array.isArray(populatedOrders) && populatedOrders.length > 0;
        });
        return filteredPayments;
    }

    async getAllPayments(): Promise<IPayment[]> {
        const payments = await PaymentModel.find();
        return payments;
    }

    async getPaymentsByStatus(orderId:string, status: string): Promise<IPayment[]> {
        const payments = await PaymentModel.find({ orderId: orderId, status: status });
        return payments;
    }

    async getPaymentsByProvider(orderId:string, provider: string): Promise<IPayment[]> {
        const payments = await PaymentModel.find({ orderId: orderId, provider: provider });
        return payments;
    }

    async updatePayment(id: string, updateData: Partial<IPayment>): Promise<IPayment | null> {
        const updatedPayment = await PaymentModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        return updatedPayment;
    }

    async deletePayment(id: string): Promise<boolean> {
        const result = await PaymentModel.findByIdAndDelete(id);
        return result ? true : false;
    }

    async updatePaymentByOrderId(orderId: string, updateData: Partial<IPayment>): Promise<IPayment | null> {
        const updatedPayment = await PaymentModel.findOneAndUpdate(
            { orderId: orderId },
            updateData,
            { new: true }
        );
        return updatedPayment;
    }
}
