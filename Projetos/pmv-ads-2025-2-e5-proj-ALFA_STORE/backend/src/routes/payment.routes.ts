import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import validate from "../middlewares/validate.middleware";
import { paymentPreferenceSchema } from "../validators/payment.validator";
import { createPreference, handleMercadoPagoWebhook } from "../controllers/payment.controller";

const router = Router();

router.post(
  "/payments/preferences",
  authMiddleware,
  validate(paymentPreferenceSchema),
  createPreference
);

// Webhook publico do Mercado Pago
router.post("/payments/webhook", handleMercadoPagoWebhook);

export default router;
