import { Router } from "express";
import { AddressController } from "../controller/address.controller";
import { authorizedMiddleware } from "../middleware/authorized.middleware";

let addressController = new AddressController();
const router = Router();

router.post("/", authorizedMiddleware, addressController.createAddress);
router.get("/", authorizedMiddleware, addressController.getAllAddressesOfAUser);
router.get("/:id", authorizedMiddleware, addressController.getAddressById);
router.patch("/:id", authorizedMiddleware, addressController.updateAddress);
router.delete("/:id", authorizedMiddleware, addressController.deleteAddress);

export default router;