import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js"; // ✅ <-- this was missing
export const addToCart = async (req, res) => {
  try {
    console.log("▶️ Request body:", req.body);
    console.log("▶️ User ID:", req.user?._id);

    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const cartItem = await Cart.findOne({ user: userId, product: productId });

    if (cartItem) {
      cartItem.quantity += 1;
      await cartItem.save();
    } else {
      await Cart.create({ user: userId, product: productId, quantity: 1 });
    }

    res.status(200).json({ message: "Product added to cart" });
  } catch (err) {
    console.error("❌ Add to cart failed:", err.message);
    res.status(500).json({ message: "Add to cart failed", error: err.message });
  }
};


// GET /api/user/cart
export const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.find({ user: userId }).populate("product");

    res.status(200).json({ cart });
  } catch (err) {
    console.error("❌ Get cart failed:", err.message);
    res.status(500).json({ message: "Failed to fetch cart", error: err.message });
  }
};

export const decreaseQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const cartItem = await Cart.findOne({ user: userId, product: productId });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      await cartItem.save();
      return res.status(200).json({ message: "Quantity decreased" });
    } else {
      // Quantity is 1, so remove it
      await cartItem.deleteOne();
      return res.status(200).json({ message: "Item removed from cart" });
    }
  } catch (err) {
    console.error("❌ Decrease quantity failed:", err.message);
    res.status(500).json({ message: "Decrease quantity failed", error: err.message });
  }
};


// DELETE /api/user/cart/:productId
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const cartItem = await Cart.findOne({ user: userId, product: productId });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItem.deleteOne();

    res.status(200).json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("❌ Remove item failed:", err.message);
    res.status(500).json({ message: "Remove item failed", error: err.message });
  }
};


// POST /api/user/cart/buy
export const buyCartItems = async (req, res) => {
  try {
    const userId = req.user._id;

    const cartItems = await Cart.find({ user: userId }).populate("product");

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Optionally update stock (if you want stock tracking)
    // for (const item of cartItems) {
    //   const product = item.product;
    //   if (product.stock < item.quantity) {
    //     return res.status(400).json({ message: `Not enough stock for ${product.name}` });
    //   }
    //   product.stock -= item.quantity;
    //   await product.save();
    // }

    // Clear cart
    await Cart.deleteMany({ user: userId });

    res.status(200).json({ message: "Purchase successful! Thank you." });
  } catch (err) {
    console.error("❌ Buy cart items failed:", err.message);
    res.status(500).json({ message: "Failed to buy items", error: err.message });
  }
};
