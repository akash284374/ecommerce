import Razorpay from "razorpay";
import Payment from "../models/paymentModel.js";

// @desc   Create Razorpay Order
// @route  POST /api/payment/create-order
// @access Private
export const createOrder = async (req, res) => {
  try {
    console.log("✅ Razorpay ENV", process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET);

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount } = req.body;

    const options = {
      amount: amount, // in paise
      currency: "INR",
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("❌ Razorpay Order Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Save payment after successful Razorpay transaction
// @route  POST /api/payment/save
// @access Private
export const savePayment = async (req, res) => {
  try {
    const { orderId, paymentId, productId, amount, currency } = req.body;

    const payment = new Payment({
      user: req.user._id,
      orderId,
      paymentId,
      productId,
      amount,
      currency,
    });

    await payment.save();

    res.status(201).json({
      message: "Payment saved successfully",
      payment,
    });
  } catch (error) {
    console.error("❌ Error saving payment:", error.message);
    res.status(500).json({ message: "Failed to save payment" });
  }
};

// @desc   Get payment history for the logged-in user
// @route  GET /api/payment/history
// @access Private
export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate("productId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ payments });
  } catch (error) {
    console.error("❌ Error fetching payment history:", error.message);
    res.status(500).json({ message: "Failed to fetch payment history" });
  }
};
