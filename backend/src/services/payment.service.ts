import { HttpError } from "../errors/http-error";
import { IPayment } from "../model/payment.model";
import { PaymentRepository } from "../repositories/payment.repository";
import * as crypto from "crypto";
import { ESEWA_MERCHANT_ID, ESEWA_SECRET_KEY, ESEWA_SUCCESS_URL, ESEWA_FAILURE_URL, ESEWA_PAYMENT_URL } from "../config";
import { Types } from "mongoose";

const paymentRepo = new PaymentRepository()
const pendingEsewaTransactions = new Map<string, { userId: string; orderIds: string[] }>();

export class PaymentService{
    async createPayment(paymentData: Partial<IPayment>){
        return await paymentRepo.createPayment(paymentData);
    }
    async getPaymentById(id: string){
        if(!id) return new HttpError(400, "Payment Id is Required");
        return await paymentRepo.getPaymentById(id);
    }
    async getPaymentsByStatus(orderId:string, status: string){
        if(!orderId) return new HttpError(400, "Order Id is Required");
        return await paymentRepo.getPaymentsByStatus(orderId, status);
    }
    async getPaymentsByProvider(orderId:string, provider: string){
        if(!orderId) return new HttpError(400, "Order Id is Required");
        return await paymentRepo.getPaymentsByProvider(orderId, provider);
    }
    async getPaymentsByOrderId(orderId: string){
        if(!orderId) return new HttpError(400, "Order Id is Required");
        return await paymentRepo.getPaymentsByOrderId(orderId)
    }

    async getPaymentsByUserId(userId: string){
        if(!userId) return new HttpError(400, "User Id is Required");
        return await paymentRepo.getPaymentsByUserId(userId);
    }
    async getPaymentsOfShop(userId: string){
        if(!userId) return new HttpError(400, "User Id is Required");
        return await paymentRepo.getPaymentsOfShop(userId);
    }
    async updatePayment(id: string, updateData: Partial<IPayment>){
        if(!id) return new HttpError(400, "Payment Id is Required");
        return await paymentRepo.updatePayment(id, updateData);
    }
    async deletePayment(id: string){
        if(!id) return new HttpError(400, "Payment Id is Required");
        return await paymentRepo.deletePayment(id);
    }

    // eSewa Payment Integration Methods
    async initializeEsewaPayment(data: {
        userId: string;
        amount: number;
        orderId: string | string[];
        productId?: string;
        productName?: string;
    }) {
        const { userId, amount, orderId, productId, productName } = data;
        const orderIds = Array.isArray(orderId) ? orderId : [orderId];
        orderIds.forEach((id) => {
            if (!Types.ObjectId.isValid(id)) {
                throw new HttpError(400, `Invalid Order ID format: ${id}`);
            }
        });
        const transactionUuid = `${orderIds[0]}-${Date.now()}`;
        pendingEsewaTransactions.set(transactionUuid, {
            userId,
            orderIds,
        });
        const esewaParams = {
            amount: amount.toString(),
            tax_amount: "0",
            total_amount: amount.toString(),
            transaction_uuid: transactionUuid,
            product_code: ESEWA_MERCHANT_ID,
            product_service_charge: "0",
            product_delivery_charge: "0",
            success_url: ESEWA_SUCCESS_URL,
            failure_url: ESEWA_FAILURE_URL,
            signed_field_names: "total_amount,transaction_uuid,product_code",
        };
        const message = `total_amount=${esewaParams.total_amount},transaction_uuid=${esewaParams.transaction_uuid},product_code=${esewaParams.product_code}`;
        const signature = crypto
            .createHmac("sha256", ESEWA_SECRET_KEY)
            .update(message)
            .digest("base64");

        return {
            esewaUrl: ESEWA_PAYMENT_URL,
            params: {
                ...esewaParams,
                signature: signature,
            },
            transactionUuid,
        };
    }

    async verifyEsewaPayment(data: {
        data: string;
        refId?: string;
    }) {
        const { data: encodedData, refId } = data;

        try {
            // Decode base64 JSON payload from eSewa success callback
            const decodedData = Buffer.from(encodedData, "base64").toString("utf-8");
            const parsedData = JSON.parse(decodedData) as {
                transaction_code?: string;
                status?: string;
                total_amount?: string | number;
                transaction_uuid?: string;
                product_code?: string;
                signed_field_names?: string;
                signature?: string;
            };

            const transactionUuid = parsedData.transaction_uuid;
            const totalAmount = Number(parsedData.total_amount);
            const status = parsedData.status;

            if (!transactionUuid) {
                throw new HttpError(400, "Missing transaction_uuid in eSewa payload");
            }

            if (!status || status !== "COMPLETE") {
                throw new HttpError(400, "Payment is not complete");
            }

            if (Number.isNaN(totalAmount) || totalAmount <= 0) {
                throw new HttpError(400, "Invalid total_amount in eSewa payload");
            }

            const pendingTransaction = pendingEsewaTransactions.get(transactionUuid);
            if (!pendingTransaction || pendingTransaction.orderIds.length === 0) {
                throw new HttpError(400, "No initialized payment context found for transaction_uuid");
            }

            const paymentData = {
                orderId: pendingTransaction.orderIds.map((id) => new Types.ObjectId(id)),
                amount: totalAmount,
                provider: "esewa",
                status: "completed",
                paid_at: new Date(),
            };

            const payment = await paymentRepo.createPayment(paymentData);
            pendingEsewaTransactions.delete(transactionUuid);

            return {
                success: true,
                payment,
                transactionId: refId || parsedData.transaction_code || transactionUuid,
                message: "Payment created after eSewa success",
            };
        } catch (error: any) {
            throw new HttpError(
                error?.statusCode || 500,
                error.message || "Failed to verify payment with eSewa"
            );
        }
    }

    async handleEsewaFailure(data: {
        orderId?: string;
        amount?: string;
        refId?: string;
        status?: string;
    }) {
        const { orderId, amount, refId, status } = data;

        // DO NOT create or update any payment record - just return failure response
        return {
            success: false,
            message: "Payment was cancelled or failed",
            orderId,
            refId,
            amount,
        };
    }
}