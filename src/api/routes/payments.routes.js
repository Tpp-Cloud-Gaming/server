import { Router } from "express";
import { PaymentController } from "../controllers/payments.controller.js";
import { param, body, validationResult } from "express-validator";

const validatePaymentRequestBody = [
  param("username").notEmpty().withMessage("Username is required").bail(),
  body("hours").notEmpty().withMessage("Hours is required").bail(),
];

export const createPaymentRouter = () => {
  const router = Router();
  const paymentController = new PaymentController();

  router.post("/payments/:username", validatePaymentRequestBody, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await paymentController.createOrder(req, res);
  });

  router.post("/payments/notif", paymentController.receiveOrder);

  router.get("/success", paymentController.logRecibido);

  router.get("/pending", paymentController.logRecibido);

  router.get("/failure", paymentController.logRecibido);

  return router;
};
