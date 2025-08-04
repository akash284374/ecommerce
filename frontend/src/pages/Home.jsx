import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const location = useLocation();

  // Get ?search= value from URL
  const query = new URLSearchParams(location.search);
  const search = query.get("search")?.toLowerCase() || "";

  useEffect(() => {
    axios
      .get(`${API}/api/products`)
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    if (search.trim()) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(search)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [search, products]);

  return (
    <div className="px-4 py-6 sm:px-8 md:px-12 lg:px-20 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        All Products
      </h1>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
