import React, { useState, useRef } from "react";
import { productAddMessage } from "../services/userService";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [newProduct, setNewProduct] = useState(null); // Store the uploaded product
  const fileInputRef = useRef(null); // To reset file input manually

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setNewProduct(null);

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("price", formData.price);
    payload.append("image", formData.image);

    try {
      const res = await productAddMessage(payload);

      console.log("Backend response product:", res.data.product); // Debug backend product response

      setMessage(res.data.message || "Product added successfully!");
      setNewProduct(res.data.product);

      // Reset form fields
      setFormData({
        name: "",
        description: "",
        price: "",
        image: null,
      });

      // Clear file input manually
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (err) {
      console.error("Add product error:", err);
      setError(err.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Add New Product</h2>

        {message && <p className="text-green-600 mb-2">{message}</p>}
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Product Name"
            className="w-full p-2 border rounded"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Product Description"
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Price (₹)"
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
            ref={fileInputRef}
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Add Product
          </button>
        </form>

        {/* Preview newly uploaded product */}
        {newProduct && (
          <div className="mt-6 text-center border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Preview:</h3>
            <img
              src={newProduct.image}
              alt={newProduct.name}
              className="mx-auto border rounded w-64 h-64 object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/256?text=No+Image";
              }}
            />
            <p className="mt-2 font-semibold">{newProduct.name} - ₹{newProduct.price}</p>
            <p className="text-gray-500">{newProduct.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProduct;
