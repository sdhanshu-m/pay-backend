import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

const app = express();

// ✅ CORS (PRODUCTION SAFE)
app.use(
  cors({
    origin: ["http://localhost:5173"], // your frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ HANDLE PREFLIGHT (IMPORTANT)
app.options("*", cors());

// ✅ JSON parser
app.use(express.json());

// ✅ WEBHOOK (raw body ONLY here)
app.use(
  "/api/payment/webhook",
  express.raw({ type: "application/json" })
);

// health
app.get("/", (req, res) => {
  res.send("API running bruddda");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

export default app;