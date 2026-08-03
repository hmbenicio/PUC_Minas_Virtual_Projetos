import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import validate from "../middlewares/validate.middleware";
import { createOrderSchema } from "../validators/order.validator";
import { createOrder, listMyOrders, listOrders } from "../controllers/order.controller";

const router = Router();

router.post("/orders", authMiddleware, validate(createOrderSchema), createOrder);
router.get("/orders", authMiddleware, adminMiddleware, listOrders);
router.get("/orders/my", authMiddleware, listMyOrders);

export default router;
