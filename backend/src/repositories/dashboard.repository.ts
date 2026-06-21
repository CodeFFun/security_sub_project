import { OrderItemModel } from "../model/order-item.model";
import { OrderModel } from "../model/order.model";
import { PaymentModel } from "../model/payment.model";
import { ProductModel } from "../model/product.model";
import { ShopModel } from "../model/shop.model";

export type DashboardGranularity = "day" | "week" | "month";

export interface IShopDashboardQuery {
    from?: Date;
    to?: Date;
    granularity: DashboardGranularity;
    topN: number;
    successStatus: string;
}

export interface IShopDashboardOverview {
    cards: {
        revenue: number;
        orders: number;
        aov: number;
        successfulPaymentRate: number;
    };
    revenueTrend: Array<{ bucket: string; value: number }>;
    paymentSplit: Array<{ provider: string; count: number; percentage: number }>;
    topProductsByRevenue: Array<{ productId: string; name: string; revenue: number; qty: number }>;
}

interface ILeanPayment {
    amount: number;
    status: string;
    provider?: string;
    paid_at?: Date;
    createdAt?: Date;
    orderId?: unknown[];
}

const getBucketKey = (date: Date, granularity: DashboardGranularity): string => {
    if (granularity === "month") {
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        return `${date.getUTCFullYear()}-${month}`;
    }

    if (granularity === "week") {
        const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
        const day = utcDate.getUTCDay();
        const diffToMonday = day === 0 ? -6 : 1 - day;
        utcDate.setUTCDate(utcDate.getUTCDate() + diffToMonday);
        const month = String(utcDate.getUTCMonth() + 1).padStart(2, "0");
        const dayOfMonth = String(utcDate.getUTCDate()).padStart(2, "0");
        return `${utcDate.getUTCFullYear()}-${month}-${dayOfMonth}`;
    }

    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${date.getUTCFullYear()}-${month}-${day}`;
};

const toNumber = (value: unknown): number => {
    const converted = Number(value);
    return Number.isFinite(converted) ? converted : 0;
};

const isInRange = (date: Date, from?: Date, to?: Date): boolean => {
    if (from && date < from) return false;
    if (to && date > to) return false;
    return true;
};

export interface IDashboardRepository {
    getShopOverview(userId: string, query: IShopDashboardQuery): Promise<IShopDashboardOverview>;
}

export class DashboardRepository implements IDashboardRepository {
    private buildEmptyOverview(): IShopDashboardOverview {
        return {
            cards: {
                revenue: 0,
                orders: 0,
                aov: 0,
                successfulPaymentRate: 0,
            },
            revenueTrend: [],
            paymentSplit: [],
            topProductsByRevenue: [],
        };
    }

    async getShopOverview(userId: string, query: IShopDashboardQuery): Promise<IShopDashboardOverview> {
        const shops = await ShopModel.find({ userId }).select("_id").lean();
        const shopIds = shops.map((shop) => String(shop._id));

        if (shopIds.length === 0) {
            return this.buildEmptyOverview();
        }

        const orders = await OrderModel.find({ shopId: { $in: shopIds } }).select("_id orderItemsId").lean();
        const orderIds = orders.map((order) => String(order._id));

        if (orderIds.length === 0) {
            return this.buildEmptyOverview();
        }

        const allowedOrderIdSet = new Set(orderIds);

        const paymentsRaw = await PaymentModel.find({ orderId: { $in: orderIds } })
            .select("amount status provider paid_at createdAt orderId")
            .lean();

        const payments = paymentsRaw as unknown as ILeanPayment[];

        const paymentsInRange = payments.filter((payment) => {
            const paymentDate = new Date(payment.paid_at ?? payment.createdAt ?? new Date());
            return isInRange(paymentDate, query.from, query.to);
        });

        const successfulPayments = paymentsInRange.filter(
            (payment) => String(payment.status).toLowerCase() === query.successStatus.toLowerCase()
        );

        const totalPayments = paymentsInRange.length;
        const successfulPaymentCount = successfulPayments.length;
        const revenue = successfulPayments.reduce((sum, payment) => sum + toNumber(payment.amount), 0);

        const successfulOrderIds = new Set<string>();
        successfulPayments.forEach((payment) => {
            const paymentOrderIds = Array.isArray(payment.orderId) ? payment.orderId : [];
            paymentOrderIds.forEach((orderId) => {
                const normalizedOrderId = String(orderId);
                if (allowedOrderIdSet.has(normalizedOrderId)) {
                    successfulOrderIds.add(normalizedOrderId);
                }
            });
        });

        const paidOrderCount = successfulOrderIds.size;
        const aov = paidOrderCount > 0 ? revenue / paidOrderCount : 0;
        const successfulPaymentRate = totalPayments > 0 ? successfulPaymentCount / totalPayments : 0;

        const trendMap = new Map<string, number>();
        successfulPayments.forEach((payment) => {
            const paymentDate = new Date(payment.paid_at ?? payment.createdAt ?? new Date());
            const bucket = getBucketKey(paymentDate, query.granularity);
            const currentAmount = trendMap.get(bucket) ?? 0;
            trendMap.set(bucket, currentAmount + toNumber(payment.amount));
        });

        const revenueTrend = Array.from(trendMap.entries())
            .map(([bucket, value]) => ({ bucket, value }))
            .sort((a, b) => a.bucket.localeCompare(b.bucket));

        const providerCountMap = new Map<string, number>();
        paymentsInRange.forEach((payment) => {
            const provider = payment.provider ? String(payment.provider) : "unknown";
            providerCountMap.set(provider, (providerCountMap.get(provider) ?? 0) + 1);
        });

        const paymentSplit = Array.from(providerCountMap.entries())
            .map(([provider, count]) => ({
                provider,
                count,
                percentage: totalPayments > 0 ? (count / totalPayments) * 100 : 0,
            }))
            .sort((a, b) => b.count - a.count);

        const paidOrderIdList = Array.from(successfulOrderIds);
        const paidOrders = orders.filter((order) => paidOrderIdList.includes(String(order._id)));

        const orderItemIdSet = new Set<string>();
        paidOrders.forEach((order) => {
            const orderItemsId = Array.isArray(order.orderItemsId) ? order.orderItemsId : [];
            orderItemsId.forEach((orderItemId) => {
                orderItemIdSet.add(String(orderItemId));
            });
        });

        let topProductsByRevenue: Array<{ productId: string; name: string; revenue: number; qty: number }> = [];

        if (orderItemIdSet.size > 0) {
            const orderItems = await OrderItemModel.find({ _id: { $in: Array.from(orderItemIdSet) } })
                .select("productId quantity unit_price")
                .lean();

            const productAggregateMap = new Map<string, { revenue: number; qty: number }>();

            orderItems.forEach((item) => {
                const productId = item.productId ? String(item.productId) : "";
                if (!productId) return;

                const quantity = toNumber(item.quantity);
                const unitPrice = toNumber(item.unit_price);
                const itemRevenue = quantity * unitPrice;

                const current = productAggregateMap.get(productId) ?? { revenue: 0, qty: 0 };
                productAggregateMap.set(productId, {
                    revenue: current.revenue + itemRevenue,
                    qty: current.qty + quantity,
                });
            });

            const sortedProducts = Array.from(productAggregateMap.entries())
                .map(([productId, aggregate]) => ({ productId, ...aggregate }))
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, query.topN);

            const topProductIds = sortedProducts.map((entry) => entry.productId);
            const products = await ProductModel.find({ _id: { $in: topProductIds } })
                .select("name")
                .lean();

            const productNameMap = new Map(products.map((product) => [String(product._id), product.name]));

            topProductsByRevenue = sortedProducts.map((entry) => ({
                productId: entry.productId,
                name: productNameMap.get(entry.productId) ?? "Unknown Product",
                revenue: entry.revenue,
                qty: entry.qty,
            }));
        }

        return {
            cards: {
                revenue,
                orders: paidOrderCount,
                aov,
                successfulPaymentRate,
            },
            revenueTrend,
            paymentSplit,
            topProductsByRevenue,
        };
    }
}
