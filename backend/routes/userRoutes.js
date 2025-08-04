import { addToCart } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/cart", protect, addToCart);
