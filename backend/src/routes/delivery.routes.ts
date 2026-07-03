import { Router } from "express";
import { DeliveryController } from "../controller/delivery.controller";
import { authorizedMiddleware } from "../middleware/authorized.middleware";

const router = Router();
const deliveryController = new DeliveryController();

router.post("/:orderId", authorizedMiddleware, deliveryController.createDelivery);
router.get("/:deliveryId", authorizedMiddleware, deliveryController.getDeliveryById);
router.get("/order/:orderId", authorizedMiddleware, deliveryController.getAllDeliveriesByOrder);
router.get("/order/:orderId/status", authorizedMiddleware, deliveryController.getAllDeliveriesByStatus);
router.get("/order/:orderId/courier", authorizedMiddleware, deliveryController.getAllDeliveriesByCourierName);
router.patch("/:deliveryId", authorizedMiddleware, deliveryController.updateDelivery);
router.delete("/:deliveryId", authorizedMiddleware, deliveryController.deleteDelivery);

export default router;
