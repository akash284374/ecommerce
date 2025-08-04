import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String, // URL or base64
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
