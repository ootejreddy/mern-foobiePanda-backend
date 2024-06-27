import express, { Request, Response } from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import OrderController from "../controllers/OrderController";

const router = express.Router();
router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtParse,
  OrderController.createCheckoutSession
);

router.get("/", jwtCheck, jwtParse, OrderController.getMyOrders);

router.post("/checkout/webhook", OrderController.stripewebhookhandler);
export default router;
