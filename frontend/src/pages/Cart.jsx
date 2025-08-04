import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/user/cart", {
        withCredentials: true,
      });
      setCartItems(data.cart);
    } catch (error) {
      toast.error("Failed to fetch cart items.");
      console.error("❌ Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleDecrease = async (productId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/user/cart/decrease/${productId}`,
        {},
        { withCredentials: true }
      );
      toast.success("Quantity decreased");
      fetchCart();
    } catch (err) {
      toast.error("Failed to decrease quantity.");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/cart/${productId}`, {
        withCredentials: true,
      });
      toast.success("Item removed");
      fetchCart();
    } catch (err) {
      toast.error("Failed to remove item.");
    }
  };

  const handleBuy = (productId, price, quantity) => {
    const totalPrice = price * quantity;
    navigate(`/payment?price=${totalPrice}&productId=${productId}`);
  };

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  if (loading)
    return <p className="p-6 text-gray-800 dark:text-white">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">🛒 My Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto">
            {cartItems.map((item, idx) => {
              const imageUrl = item.product.image.startsWith("http")
                ? item.product.image
                : `http://localhost:5000/uploads/${item.product.image}`;

              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow flex flex-col justify-between p-3 aspect-square"
                >
                  <img
                    src={imageUrl}
                    alt={item.product.name}
                    className="w-full h-40 object-contain rounded-md mb-3 bg-white"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.product.name}</h3>
                    <p className="text-sm mb-1">₹{item.product.price}</p>
                    <p className="text-sm mb-2">Qty: {item.quantity}</p>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    <button
                      onClick={() => handleDecrease(item.product._id)}
                      className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-sm"
                    >
                      ➖ Qty
                    </button>
                    <button
                      onClick={() => handleRemove(item.product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      🗑 Remove
                    </button>
                    <button
                      onClick={() =>
                        handleBuy(item.product._id, item.product.price, item.quantity)
                      }
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      💳 Buy
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8 text-xl font-semibold">
            🧾 Total Amount: ₹{totalAmount}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
