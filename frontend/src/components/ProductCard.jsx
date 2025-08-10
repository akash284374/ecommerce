import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart } from "../services/userService";

const ProductCard = ({ product }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id);
      toast.success("✅ Added to cart");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("❌ Failed to add to cart");
    }
  };

  const handleBuyNow = () => {
    navigate(`/payment?price=${product.price}&productId=${product._id}`);
  };

  // ✅ Image handling with cache-busting
  const fallbackImage = "https://via.placeholder.com/300x200?text=No+Image";
  const imageUrl =
    product.image && product.image.startsWith("http")
      ? `${product.image}?t=${Date.now()}`
      : fallbackImage;

  // Console log for debugging the image URL
  console.log("Rendering product image URL:", imageUrl);

  return (
    <div className="w-full max-w-xs bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
      {/* Image Section */}
      <div className="w-full aspect-[3/2] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl overflow-hidden flex items-center justify-center p-3">
        <img
          src={imageUrl}
          alt={product.name || "Product"}
          className="max-h-full max-w-full object-contain drop-shadow"
          onError={(e) => (e.target.src = fallbackImage)}
        />
      </div>

      {/* Debug URL (hidden in production) */}

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {product.description || "No description"}
        </p>
        <p className="text-lg font-bold text-blue-600 dark:text-yellow-400 mt-1">
          ₹{product.price}
        </p>

        {/* Actions */}
        {!loading ? (
          user ? (
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white py-1 rounded"
              >
                Add
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 text-sm bg-green-600 hover:bg-green-700 text-white py-1 rounded"
              >
                Buy
              </button>
            </div>
          ) : (
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Login to purchase
            </p>
          )
        ) : (
          <p className="mt-3 text-xs text-gray-400">Loading auth...</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
