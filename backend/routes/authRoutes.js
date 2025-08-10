import express from "express";
import {
  sendOtp,
  verifyOtp,
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  getAllUsers,
  sendForgotPasswordOtp,       // added
  verifyForgotPasswordOtp,     // added
  resetForgotPassword,
  deleteUser          // added
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

router.get("/me", protect, getCurrentUser);
router.put("/update-profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.delete("/delete-account", protect, deleteUser);


// Forgot Password Routes
router.post("/forgot-password/send-otp", sendForgotPasswordOtp);
router.post("/forgot-password/verify-otp", verifyForgotPasswordOtp);
router.put("/forgot-password/reset", resetForgotPassword);

// Admin route to get all users
router.get("/admin/users", protect, authorizeRoles("admin"), getAllUsers);

export default router;
