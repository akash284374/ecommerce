import Order from "../models/orderModel.js";

// 🧾 GET all orders for the logged-in user
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("products.product")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// 📦 POST create a new order after successful payment
export const createOrder = async (req, res) => {
  try {
    const { paymentId, productId, amount } = req.body;

    const newOrder = new Order({
      user: req.user._id,
      products: [
        {
          product: productId,
          quantity: 1,
        },
      ],
      totalAmount: amount,
      paymentId,
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order saved successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ message: "Failed to save order" });
  }
};

// 🧾 GET all orders for admin
export const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    res.status(500).json({ message: "Failed to fetch admin orders" });
  }
};
