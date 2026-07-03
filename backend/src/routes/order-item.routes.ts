import { Router } from "express";
import { OrderItemController } from "../controller/order-item.controller";
import { authorizedMiddleware } from "../middleware/authorized.middleware";

const router = Router();
const orderItemController = new OrderItemController();

router.post("/", authorizedMiddleware, orderItemController.createOrderItem);
router.get("/:id", authorizedMiddleware, orderItemController.getOrderItemById);
router.patch("/:id", authorizedMiddleware, orderItemController.updateOrderItem);
router.delete("/:id", authorizedMiddleware, orderItemController.deleteOrderItem);

export default router;
