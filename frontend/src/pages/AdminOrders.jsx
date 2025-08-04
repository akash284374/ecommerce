import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { axiosInstance } from "../services/authService";

const AdminOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance(); // consider axiosInstance.get("/admin/orders")
      setOrders(res?.data?.orders || []);
    } catch (err) {
      console.error("Failed to fetch admin orders:", err);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchOrders();
    }
  }, [user]);

  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-black">
        📦 All Orders
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {orders?.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No orders found</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-300 dark:border-gray-700 p-5 rounded-lg shadow-md bg-white dark:bg-gray-800"
            >
              <div className="mb-3">
                <p>
                  <span className="font-semibold">Order ID:</span> {order._id}
                </p>
                <p>
                  <span className="font-semibold">User:</span> {order.user?.name} (
                  {order.user?.email})
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="mb-3">
                <span className="font-semibold">Items:</span>
                <ul className="list-disc ml-6">
                  {order.products.map((item, idx) => (
                    <li key={idx}>
                      {item.product?.name} × {item.quantity} = ₹
                      {item.product?.price * item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-2">
                <span className="font-semibold">Total:</span> ₹{order.totalAmount}
              </div>

              <div className="mt-1">
                <span className="font-semibold">Status:</span>{" "}
                {order.status || "Processing"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
