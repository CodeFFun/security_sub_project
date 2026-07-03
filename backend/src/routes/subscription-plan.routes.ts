import { Router } from "express";
import { SubscriptionPlanController } from "../controller/subscription-plan.controller";
import { authorizedMiddleware } from "../middleware/authorized.middleware";

const router = Router();
const subscriptionPlanController = new SubscriptionPlanController();

router.post("/", authorizedMiddleware, subscriptionPlanController.createSubscriptionPlan);
router.get("/shop/:shopId/active", authorizedMiddleware, subscriptionPlanController.getActiveSubscriptionPlansByActiveStatus);
router.get("/shop/:shopId", authorizedMiddleware, subscriptionPlanController.getySubscriptionPlansByShopId);
router.get("/:id", authorizedMiddleware, subscriptionPlanController.getSubscriptionPlanById);
router.patch("/:id", authorizedMiddleware, subscriptionPlanController.updateSubscriptionPlan);
router.delete("/:id", authorizedMiddleware, subscriptionPlanController.deleteSubscriptionPlan);

export default router;
