import { ShopCategoryController } from "../controller/shop-category.controller";
import { Router } from "express";
import { adminOnlyMiddleware, authorizedMiddleware } from "../middleware/authorized.middleware";

let shopCategoryController = new ShopCategoryController();
const router = Router();

router.use(authorizedMiddleware);
router.get("/", shopCategoryController.getAllShopCategories);
router.get("/:id", shopCategoryController.getShopCategoryById);
router.post("/create", adminOnlyMiddleware,shopCategoryController.createShopCategory);
router.patch("/:id", adminOnlyMiddleware,shopCategoryController.updateShopCategory);
router.delete("/:id", adminOnlyMiddleware, shopCategoryController.deleteShopCategory);

export default router;
