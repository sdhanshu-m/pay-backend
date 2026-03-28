import crypto from "crypto";
import prisma from "../config/db.js";
import razorpay from "../utils/razorpay.js";
import { env } from "../config/env.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // save in DB
    await prisma.payment.create({
      data: {
        userId: req.user.id,
        amount,
        razorpayOrderId: order.id,
        status: "created",
      },
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create order" });
  }
};

// VERIFY PAYMENT (frontend success)
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // update DB (idempotent safe)
    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // already paid check (important)
    if (payment.status === "paid") {
      return res.json({ message: "Already verified" });
    }

    await prisma.payment.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid",
      },
    });

    res.json({ message: "Payment verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
};

// WEBHOOK (backup verification)
export const webhookHandler = async (req, res) => {
  try {
    const webhookSignature = req.headers["x-razorpay-signature"];

    const expected = crypto
      .createHmac("sha256", env.WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (expected !== webhookSignature) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const event = req.body;

    if (event.event === "payment.captured") {
      const paymentEntity = event.payload.payment.entity;

      const orderId = paymentEntity.order_id;

      await prisma.payment.updateMany({
        where: { razorpayOrderId: orderId },
        data: {
          razorpayPaymentId: paymentEntity.id,
          status: "paid",
        },
      });
    }

    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ message: "Webhook error" });
  }
};

// PAYMENT HISTORY
export const getHistory = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};