import { PaymentService } from "../services/payment.service";
import { CreatePaymentDTO, UpdatePaymentDTO } from "../dtos/payment.dtos";
import { Request, Response } from "express";
import z from "zod";

const paymentService = new PaymentService();

export class PaymentController {
    async createPayment(req: Request, res: Response) {
        try {
            const parsedData = CreatePaymentDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                );
            }
            const paymentData: Partial<CreatePaymentDTO> = parsedData.data;
            const newPayment = await paymentService.createPayment(paymentData);
            return res.status(201).json(
                { success: true, message: "Payment Created", data: newPayment }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }
    async getPaymentById(req: Request, res: Response) {
        try {
            const paymentId = req.params.id;
            const payment = await paymentService.getPaymentById(paymentId);
            return res.status(200).json(
                { success: true, message: "Payment retrieved", data: payment }
            );
        }
        catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getPaymentsByUserId(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if(!userId) return res.status(400).json(
                { success: false, message: "User Id is Required" }
            );
            const payments = await paymentService.getPaymentsByUserId(userId);
            return res.status(200).json(
                { success: true, message: "Payments retrieved", data: payments }
            );
        }
        catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getPaymentsOfShop(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if(!userId) return res.status(400).json(
                { success: false, message: "User Id is Required" }
            );
            const payments = await paymentService.getPaymentsOfShop(userId);
            return res.status(200).json(
                { success: true, message: "Payments retrieved", data: payments }
            );
        }
        catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getPaymentsByStatus(req: Request, res: Response) {
        try {
            const orderId = req.params.orderId;
            const status = req.query.status as string;
            const payments = await paymentService.getPaymentsByStatus(orderId, status);
            return res.status(200).json(
                { success: true, message: "Payments retrieved", data: payments }
            );
        }catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getPaymentsByProvider(req: Request, res: Response) {
        try {
            const orderId = req.params.orderId;
            const provider = req.query.provider as string;
            const payments = await paymentService.getPaymentsByProvider(orderId, provider);
            return res.status(200).json(
                { success: true, message: "Payments retrieved", data: payments }
            );
        }catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getPaymentsByOrderId(req: Request, res: Response) {
        try {
            const orderId = req.params.orderId;
            const payments = await paymentService.getPaymentsByOrderId(orderId);
            return res.status(200).json(
                { success: true, message: "Payments retrieved", data: payments }
            );
        }
        catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }
    async updatePayment(req: Request, res: Response) {
        try {
            const paymentId = req.params.id;
            const parsedData = UpdatePaymentDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                );
            }
            const updateData: Partial<UpdatePaymentDTO> = parsedData.data;
            const updatedPayment = await paymentService.updatePayment(paymentId, updateData);
            return res.status(200).json(
                { success: true, message: "Payment updated", data: updatedPayment }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }
    async deletePayment(req: Request, res: Response) {
        try {
            const paymentId = req.params.id;
            await paymentService.deletePayment(paymentId);
            return res.status(200).json(
                { success: true, message: "Payment deleted" }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    // eSewa Payment Integration
    async initializeEsewaPayment(req: Request, res: Response) {
        try {
            const { amount, orderId, productId, productName } = req.body;
            const userId = req.user?._id;

            if (!userId) {
                return res.status(400).json(
                    { success: false, message: "User ID is required" }
                );
            }

            if (!amount || !orderId) {
                return res.status(400).json(
                    { success: false, message: "Amount and Order ID(s) are required" }
                );
            }

            // Validate ObjectId format(s)
            const orderIds = Array.isArray(orderId) ? orderId : [orderId];
            const invalidIds = orderIds.filter(id => !/^[0-9a-fA-F]{24}$/.test(id));
            
            if (invalidIds.length > 0) {
                return res.status(400).json(
                    { success: false, message: `Invalid Order ID format. Must be valid MongoDB ObjectId(s) (24 character hex string). Invalid: ${invalidIds.join(", ")}` }
                );
            }

            const esewaPaymentData = await paymentService.initializeEsewaPayment({
                userId,
                amount,
                orderId: orderIds,
                productId,
                productName
            });

            return res.status(200).json({
                success: true,
                message: "eSewa payment initialized",
                data: esewaPaymentData
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async verifyEsewaPayment(req: Request, res: Response) {
        try {
            const { data, refId } = req.query;

            if (!data) {
                return res.redirect("http://localhost:3000/customer/cart");
            }

            await paymentService.verifyEsewaPayment({
                data: data as string,
                refId: refId as string | undefined,
            });

            return res.redirect("http://localhost:3000/customer/cart");
        } catch (error: Error | any) {
            return res.redirect("http://localhost:3000/customer/cart");
        }
    }

    async handleEsewaFailure(req: Request, res: Response) {
        try {
            const { oid, amt, refId } = req.query;

            const failureData = {
                orderId: oid as string,
                amount: amt as string,
                refId: refId as string,
                status: "failed",
            };

            await paymentService.handleEsewaFailure(failureData);

            return res.redirect("http://localhost:3000/customer/cart");
        } catch (error: Error | any) {
            return res.redirect("http://localhost:3000/customer/cart");
        }
    }

}