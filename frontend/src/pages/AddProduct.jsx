// src/pages/AddProduct.jsx
import React, { useState } from "react";
import axios from "axios";
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

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("price", formData.price);
    payload.append("image", formData.image);

    try {
      const res = await  productAddMessage(payload)

      setMessage(res.data.message || "Product added successfully!");
      setFormData({
        name: "",
        description: "",
        price: "",
        image: null,
      });
    } catch (err) {
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
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
