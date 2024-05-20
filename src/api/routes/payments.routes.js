import { Router } from "express";
import { PaymentController } from "../controllers/payments.controller.js";
import { body, validationResult } from "express-validator";

const validatePaymentRequestBody = [
  body("hours").notEmpty().withMessage("Category is required").bail(),
];

export const createPaymentRouter = () => {
  const router = Router();
  const paymentController = new PaymentController();

  router.post("/payments/", validatePaymentRequestBody, async (req, res) => {
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
