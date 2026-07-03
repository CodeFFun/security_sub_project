import { Router } from "express";
import { SubscriptionController } from "../controller/subscription.controller";
import { authorizedMiddleware } from "../middleware/authorized.middleware";

const router = Router();
const subscriptionController = new SubscriptionController();

router.post("/shop/:shopId", authorizedMiddleware, subscriptionController.createSubscription);
router.get("/shop/:shopId", authorizedMiddleware, subscriptionController.getAllSubscriptionsOfAShop);
router.get("/user", authorizedMiddleware, subscriptionController.getAllSubscriptionsOfAUser);
router.get("/user/status", authorizedMiddleware, subscriptionController.getSubscriptionsByStatus);
router.get("/:id", authorizedMiddleware, subscriptionController.getSubscriptionById);
router.patch("/:id", authorizedMiddleware, subscriptionController.updateSubscription);
router.delete("/:id", authorizedMiddleware, subscriptionController.deleteSubscription);

export default router;
