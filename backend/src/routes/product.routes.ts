import { Router } from "express";
import { ProductController } from "../controller/product.controller";
import { authorizedMiddleware } from "../middleware/authorized.middleware";

const router = Router();
const productController = new ProductController();

router.post("/shop/:shopId", authorizedMiddleware, productController.createProduct);
router.get("/shop/:shopId", authorizedMiddleware, productController.getProductsByShopId);
router.get("/shop/:shopId/search", authorizedMiddleware, productController.getProductByName);
router.get("/:productId", authorizedMiddleware, productController.getProductById);
router.patch("/:productId", authorizedMiddleware, productController.updateProduct);
router.delete("/:productId", authorizedMiddleware, productController.deleteProduct);

export default router;
