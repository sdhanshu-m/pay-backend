import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

// health
app.get("/", (req, res) => {
  res.send("API running");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

export default app;