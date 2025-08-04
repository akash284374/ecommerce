import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

// ✅ Make user + product unique together
cartSchema.index({ user: 1, product: 1 }, { unique: true });

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
