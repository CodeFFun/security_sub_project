import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { authorizedMiddleware, adminOnlyMiddleware } from "../middleware/authorized.middleware";
import { uploads } from "../middleware/upload.middleware";
import { rateLimit } from "../middleware/security.middleware";

let authController = new AuthController();
const router = Router();

// Throttle credential-sensitive endpoints to slow brute-force / abuse.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30,
    message: "Too many attempts. Please wait a few minutes and try again.",
});

router.get("/profile", authorizedMiddleware, authController.getProfile)
// router.get("/users", authController.getAllUsers)
router.get("/users/:id", authController.getUserById)
router.get("/users/role/:role", authController.getUSersByRole)
router.post("/register", authLimiter, authController.register)
router.post("/login", authLimiter, authController.login)
router.patch("/update", authorizedMiddleware, uploads.single("profilePictureUrl"), authController.updateUser)
router.patch("/update-by-email", authLimiter, authController.updateUserByEmail);
//admin routes
router.post("/admin/create-users", authorizedMiddleware,adminOnlyMiddleware, authController.adminCreateUser);
router.get("/admin/users", authorizedMiddleware,adminOnlyMiddleware, authController.getAllUsers);
router.get("/admin/users/:id",authorizedMiddleware,adminOnlyMiddleware, authController.getUserById);
router.patch("/admin/update-users/:id", authorizedMiddleware,adminOnlyMiddleware, uploads.single("profilePictureUrl"), authController.updateUserByAdmin);

export default router;
