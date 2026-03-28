import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,

  DATABASE_URL: process.env.DATABASE_URL,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",

  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,

  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,

  FRONTEND_URL: process.env.FRONTEND_URL,
};

// Basic fail-fast (important)
if (!env.JWT_SECRET || !env.DATABASE_URL) {
  throw new Error("Missing critical environment variables");
}