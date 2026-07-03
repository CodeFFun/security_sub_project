import { Router } from "express";
import { OrderController } from "../controller/order.controller";
import { authorizedMiddleware } from "../middleware/authorized.middleware";

const router = Router();
const orderController = new OrderController();

router.post("/shop/:shopId", authorizedMiddleware, orderController.createOrder);
router.get("/user", authorizedMiddleware, orderController.getOrdersByUserId);
router.get("/shop/:shopId", authorizedMiddleware, orderController.getOrdersByShopId);
router.get("/subscription/:subscriptionId", authorizedMiddleware, orderController.getOrdersBySubscriptionId);
router.get("/:id", authorizedMiddleware, orderController.getOrderById);
router.patch("/:id", authorizedMiddleware, orderController.updateOrder);
router.delete("/:id", authorizedMiddleware, orderController.deleteOrder);

export default router;
