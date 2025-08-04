import express from "express";
import {
  addProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ✅ Public Route - Anyone can view products
router.get("/", getAllProducts);

// ✅ Admin Routes
router.post(
  "/add",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  addProduct
);

router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  getAllProducts
);

router.delete(
  "/admin/:id",
  protect,
  authorizeRoles("admin"),
  deleteProduct
);

router.put(
  "/admin/:id",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  updateProduct
);

export default router;
