import { ShopController } from "../controller/shop.controller";
import { Router } from "express";
import { authorizedMiddleware,  shopOnlyMiddleware} from "../middleware/authorized.middleware";
import { uploads } from "../middleware/upload.middleware";

let shopController = new ShopController();
const router = Router();

router.get("/all", authorizedMiddleware, shopController.getAllShops);
router.get("/user", authorizedMiddleware, shopOnlyMiddleware, shopController.getAllShopsOfAUser);
router.get("/:id", authorizedMiddleware, shopController.getShopById);
router.post("/create", authorizedMiddleware, shopOnlyMiddleware, uploads.single("shop_banner"), shopController.createShop);
router.patch("/:id", authorizedMiddleware, shopOnlyMiddleware, uploads.single("shop_banner"), shopController.updateShop);
router.delete("/:id", authorizedMiddleware, shopOnlyMiddleware, shopController.deleteShop);

export default router;
