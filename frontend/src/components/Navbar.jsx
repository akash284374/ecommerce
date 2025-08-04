import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  ShoppingCart,
  Settings,
  LogOut,
  CreditCard,
  Users,
  FileText,
  Sun,
  Moon,
} from "lucide-react";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const getInitial = (email) => (email ? email[0].toUpperCase() : "?");

  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    setDarkMode(!darkMode);
  };

  // Hide search bar on these routes
  const hideSearchRoutes = [
    "/cart",
    "/dashboard",
    "/payment",
    "/admin/users",
    "/admin/orders",
  ];
  const shouldHideSearch = hideSearchRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  // Live search handler
  const handleLiveSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/products");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    setSearchQuery(search);
  }, [location.search]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <nav className="bg-white dark:bg-gray-900 text-black dark:text-white px-6 py-4 shadow flex justify-between items-center">
      {/* Left: Logo + Search */}
      <div className="flex items-center gap-6">
        <Link to="/" className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
          FlexKicks
        </Link>

        {!shouldHideSearch && (
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleLiveSearch}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm w-72"
          />
        )}
      </div>

      {/* Right: Links */}
      <div className="flex items-center gap-4">
        <Link to="/" className="hover:underline">Home</Link>
        {user && <Link to="/dashboard" className="hover:underline">Dashboard</Link>}

        {user?.role !== "admin" && (
          <Link to="/cart" title="Cart">
            <ShoppingCart size={20} />
          </Link>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle Theme"
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {user && (
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-white font-bold rounded-full flex items-center justify-center">
            {getInitial(user.email)}
          </div>
        )}

        {user ? (
          <div className="relative">
            <button onClick={toggleMenu}>
              <Menu size={24} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-md py-2 z-50 w-52 border border-gray-200 dark:border-gray-700">
                {user.role === "admin" ? (
                  <>
                    <Link
                      to="/admin/users"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Users size={16} /> User Details
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <FileText size={16} /> Orders
                    </Link>
                    <Link
                      to="/admin/products"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      🛒 Manage Products
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/payment"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <CreditCard size={16} /> Payment
                  </Link>
                )}

                {/* ✅ Shared Settings Option */}
                <Link
                  to="/settings"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Settings size={16} /> Settings
                </Link>

                <button
                  onClick={logoutUser}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
