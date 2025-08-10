import Product from "../models/productModel.js";
import { uploadImage } from "../config/cloudinary.js";

// ✅ Add Product
export const addProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const localPath = req.file.path.replace(/\\/g, "/"); // normalize Windows path
    let imageUrl;

    // Upload & let uploadImage handle file deletion
    imageUrl = await uploadImage(localPath);
    console.log("📸 Uploaded to Cloudinary:", imageUrl);

    if (!imageUrl) {
      return res.status(500).json({ message: "Failed to upload image" });
    }

    const newProduct = await Product.create({
      name,
      price,
      description,
      image: imageUrl, // Save full secure_url
    });

    res.status(201).json({
      message: "✅ Product created successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error("❌ Error in addProduct:", err);
    res.status(500).json({
      message: "Failed to create product",
      error: err.message,
    });
  }
};

// ✅ Get All Products (sorted by newest first)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ products });
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    res.status(500).json({
      message: "Failed to fetch products",
      error: err.message,
    });
  }
};

// ✅ Delete a Product
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "✅ Product deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting product:", err.message);
    res.status(500).json({
      message: "Failed to delete product",
      error: err.message,
    });
  }
};

// ✅ Update a Product
export const updateProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const updatedData = { name, price, description };

    if (req.file) {
      const localPath = req.file.path.replace(/\\/g, "/");
      const imageUrl = await uploadImage(localPath);
      console.log("📸 Updated Cloudinary Image URL:", imageUrl);

      if (!imageUrl) {
        return res.status(500).json({ message: "Failed to upload image" });
      }

      updatedData.image = imageUrl;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "✅ Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("❌ Error updating product:", err.message);
    res.status(500).json({
      message: "Failed to update product",
      error: err.message,
    });
  }
};
