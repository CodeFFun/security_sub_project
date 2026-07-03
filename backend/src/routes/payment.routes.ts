import { Router } from "express";
import { PaymentController } from "../controller/payment.controller";
import { authorizedMiddleware } from "../middleware/authorized.middleware";

const router = Router();
const paymentController = new PaymentController();

router.post("/", authorizedMiddleware, paymentController.createPayment);
router.get("/user", authorizedMiddleware, paymentController.getPaymentsByUserId);
router.get("/shop", authorizedMiddleware, paymentController.getPaymentsOfShop);
router.get("/order/:orderId", authorizedMiddleware, paymentController.getPaymentsByOrderId);
router.get("/order/:orderId/status", authorizedMiddleware, paymentController.getPaymentsByStatus);
router.get("/order/:orderId/provider", authorizedMiddleware, paymentController.getPaymentsByProvider);
router.get("/:id", authorizedMiddleware, paymentController.getPaymentById);
router.patch("/:id", authorizedMiddleware, paymentController.updatePayment);
router.delete("/:id", authorizedMiddleware, paymentController.deletePayment);

// eSewa integration routes
router.post("/esewa/initialize", authorizedMiddleware, paymentController.initializeEsewaPayment);
router.get("/esewa/success", paymentController.verifyEsewaPayment);
router.get("/esewa/failure", paymentController.handleEsewaFailure);

export default router;
