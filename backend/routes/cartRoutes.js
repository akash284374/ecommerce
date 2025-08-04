import express from "express";
import { addToCart, getUserCart ,decreaseQuantity,removeCartItem,buyCartItems} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.post("/buy", protect, buyCartItems);
router.get("/", protect, getUserCart); // 👈 NEW
router.put("/decrease/:productId", protect, decreaseQuantity);
router.delete("/:productId", protect, removeCartItem);

export default router;
