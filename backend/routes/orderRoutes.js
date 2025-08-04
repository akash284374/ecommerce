// backend/routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  getUserOrders,
  getAllOrdersForAdmin, // ✅ new controller
} from "../controllers/orderController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/orders — create a new order
router.post("/", protect, createOrder);

// GET /api/orders/user — get all orders of logged-in user
router.get("/user", protect, getUserOrders);

// ✅ GET /api/orders/admin — get all users' orders (admin only)
router.get("/admin", protect, isAdmin, getAllOrdersForAdmin);

export default router;
