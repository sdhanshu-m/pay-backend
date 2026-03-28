import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

const app = express();

// ✅ Proper CORS (this alone is enough)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://pay-frontend-beta.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ JSON parser
app.use(express.json());

// ✅ Webhook raw body (must be after CORS)
app.use(
  "/api/payment/webhook",
  express.raw({ type: "application/json" })
);

// health
app.get("/", (req, res) => {
  res.send("API running");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

export default app;