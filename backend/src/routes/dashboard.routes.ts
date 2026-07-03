import { Router } from "express";
import { DashboardController } from "../controller/dashboard.controller";
import { authorizedMiddleware, shopOnlyMiddleware } from "../middleware/authorized.middleware";

const router = Router();
const dashboardController = new DashboardController();

router.get("/", authorizedMiddleware, shopOnlyMiddleware, dashboardController.getRoot);
router.get("/shop/overview", authorizedMiddleware, shopOnlyMiddleware, dashboardController.getShopOverview);

export default router;
