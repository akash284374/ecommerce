import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPaymentHistory, paymentHandle, paymentSave, userOrders } from "../services/productService";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const price = parseInt(query.get("price"), 10);
  const productId = query.get("productId");

  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchPaymentHistory = async () => {
    try {
      const { data } = await getPaymentHistory();
      setHistory(data.payments || []);
    } catch (err) {
      console.error("❌ Failed to fetch payment history", err);
    }
  };

  const handlePayment = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      setError("❌ Razorpay SDK failed to load.");
      setStatus("failed");
      return;
    }

    setStatus("initiating");

    try {
      const { data } = await paymentHandle(price * 100); // price in paise

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "FlexKicks",
        description: "Purchase Shoes",
        order_id: data.order.id,
        handler: async function (response) {
          const details = {
            orderId: data.order.id,
            paymentId: response.razorpay_payment_id,
            productId,
            amount: data.order.amount / 100,
            currency: data.order.currency,
          };

          console.log("📤 Sending Payment Details:", details); // Debug

          try {
            const res = await paymentSave(details);
            console.log("✅ Payment saved to backend:", res.data);

            // await userOrders();
            await userOrders({
  paymentId: response.razorpay_payment_id,
  productId,
  amount: data.order.amount / 100, // or use raw `price` if needed
});


            setPaymentDetails(details);
            setStatus("success");
            fetchPaymentHistory();

            setTimeout(() => {
              navigate("/orders");
            }, 2000);
          } catch (err) {
            console.error("❌ Failed to save order/payment:", err);
            setError("Failed to save order or payment.");
            setStatus("failed");
          }
        },
        prefill: {
          name: "Akash Kumar",
          email: "akash@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setStatus("launched");
    } catch (err) {
      console.error("❌ Failed to initiate payment", err);
      setError("Failed to initiate payment.");
      setStatus("failed");
    }
  };

  useEffect(() => {
    fetchPaymentHistory();

    if (!price || !productId) {
      setError("Invalid product or price information.");
      setStatus("failed");
      return;
    }

    handlePayment();
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Payment Status UI */}
        {status !== "idle" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center space-y-4">
            {status === "initiating" && (
              <>
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <h1 className="text-xl font-bold">Preparing Payment...</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please wait while we redirect you to Razorpay.
                </p>
              </>
            )}
            {status === "launched" && (
              <>
                <h1 className="text-xl font-bold text-green-500">Redirected to Razorpay</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  If nothing happens, please refresh the page.
                </p>
              </>
            )}
            {status === "failed" && (
              <>
                <h1 className="text-xl font-bold text-red-500">Payment Failed</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
                <button
                  onClick={handlePayment}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  Retry
                </button>
              </>
            )}
            {status === "success" && paymentDetails && (
              <>
                <h1 className="text-xl font-bold text-green-500">✅ Payment Successful!</h1>
                <div className="text-left mt-4 space-y-2 bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                  <p><strong>Product ID:</strong> {paymentDetails.productId}</p>
                  <p><strong>Order ID:</strong> {paymentDetails.orderId}</p>
                  <p><strong>Payment ID:</strong> {paymentDetails.paymentId}</p>
                  <p><strong>Amount:</strong> ₹{paymentDetails.amount}</p>
                  <p><strong>Currency:</strong> {paymentDetails.currency}</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* History Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">🧾 Payment History</h2>
          {history.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">No payment history yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-200 dark:bg-gray-700 text-left">
                  <tr>
                    <th className="p-2">Order ID</th>
                    <th className="p-2">Payment ID</th>
                    <th className="p-2">Amount (₹)</th>
                    <th className="p-2">Currency</th>
                    <th className="p-2">Product</th>
                    <th className="p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, idx) => (
                    <tr key={idx} className="border-b dark:border-gray-700">
                      <td className="p-2">{item.orderId}</td>
                      <td className="p-2">{item.paymentId}</td>
                      <td className="p-2">₹{item.amount}</td>
                      <td className="p-2">{item.currency}</td>
                      <td className="p-2">{item?.productId?.name || item?.productId}</td>
                      <td className="p-2">{new Date(item.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
