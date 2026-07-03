import { ProductCategoryController } from "../controller/product-category.controller";
import { Router } from "express";
import { authorizedMiddleware, shopOnlyMiddleware } from "../middleware/authorized.middleware";

let productCategoryController = new ProductCategoryController();
const router = Router();

router.use(authorizedMiddleware);
router.get("/shop/:shopId", productCategoryController.getAllProductCategoriesByShopId);
router.use(shopOnlyMiddleware)

router.get("/", productCategoryController.getAllProductCategories);
router.post("/create", productCategoryController.createProductCategory);
router.get("/:id", productCategoryController.getProductCategoryById);
router.patch("/:id", productCategoryController.updateProductCategory);
router.delete("/:id", productCategoryController.deleteProductCategory);

export default router;
