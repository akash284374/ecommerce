import React from "react";
import { Routes, Route } from "react-router-dom";

// Public Pages
import Register from "../pages/Register";
import Login from "../pages/Login";
import OtpVerification from "../pages/OtpVerification";
import Home from "../pages/Home";
import Unauthorized from "../pages/Unauthorized";

// User Pages
import Dashboard from "../pages/Dashboard";
import Cart from "../pages/Cart";
import Payment from "../pages/Payment";
import Settings from "../pages/Settings";
import Orders from "../pages/Orders"; // ✅ Order history page

// Admin Pages
import AddProduct from "../pages/AddProduct";
import AdminProducts from "../pages/AdminProducts";
import AdminUsers from "../pages/AdminUsers";
import AdminOrders from "../pages/AdminOrders";

// Shared Components
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Home />} /> {/* ✅ for search queries */}
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<OtpVerification />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/add-product"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AddProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminOrders />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
