import express from "express";
import {
  createOrder,
  savePayment,
  getPaymentHistory,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 Optional: make this protected if user must be logged in to initiate payment
router.post("/create-order", protect, createOrder);

// ✅ Save successful payment
router.post("/save", protect, savePayment);

// ✅ Get user payment history
router.get("/history", protect, getPaymentHistory);

export default router;
