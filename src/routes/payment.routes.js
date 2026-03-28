import express from "express";
import {
  createOrder,
  verifyPayment,
  webhookHandler,
  getHistory,
} from "../controllers/payment.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.post("/verify-payment", protect, verifyPayment);
router.post("/webhook", express.json(), webhookHandler); // important
router.get("/history", protect, getHistory);

export default router;