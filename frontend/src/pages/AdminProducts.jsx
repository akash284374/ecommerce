import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // ✅ Import auth context
import { adminDeleteProduct, getAdminProduct } from "../services/userService";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth(); // ✅ Get current user
  // console.log("👤 Logged-in user:", user);
  useEffect(() => {
    console.log("👤 Logged-in user:", user);
  }, [user]);

  const fetchProducts = async () => {
    try {
      const res = await  getAdminProduct();
      setProducts(res.data.products);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    }
  };

  const handleDelete = async (productId) => {
    try {
      await adminDeleteProduct(productId);
      fetchProducts();
    } catch (err) {
      console.error("❌ Delete failed:", err);
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Products</h2>
      {error && <p className="text-red-500">{error}</p>}

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded shadow">
              {/* <img
                src={`${import.meta.env.VITE_BACKEND_URL}/${product.image}`}
                alt={product.name}
                className="h-40 w-full object-cover mb-2"
              /> */}

              <img
                src={
                  product.image
                    ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${product.image}`
                    : "/no-image.png"
                }
                alt={product.name}
                // className="h-40 w-full object-cover mb-2"
                className="h-40 w-full object-contain mb-2"

              />

              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">₹{product.price}</p>
              <p className="text-sm mt-1">{product.description}</p>

              {/* ✅ Show Delete only if user is admin */}
              {user?.role === "admin" && (
                <button
                  onClick={() => handleDelete(product._id)}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
