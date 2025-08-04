import express from "express";
import { getAllUsers } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ Admin - Get All Users
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

export default router;
