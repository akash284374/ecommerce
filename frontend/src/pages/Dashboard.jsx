// src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Welcome, {user?.name || "User"} 👋
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4">
          <p className="text-lg">
            You are logged in as{" "}
            <span className="font-semibold capitalize text-blue-600 dark:text-blue-400">
              {user?.role}
            </span>
            .
          </p>

          {user?.role === "admin" ? (
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <DashboardCard
                title="Add Product"
                link="/admin/add-product"
                color="bg-indigo-600"
              />
              <DashboardCard
                title="Manage Products"
                link="/admin/products"
                color="bg-yellow-500"
              />
              <DashboardCard
                title="All Orders"
                link="/admin/orders"
                color="bg-green-600"
              />
              <DashboardCard
                title="User Details"
                link="/admin/users"
                color="bg-pink-600"
              />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <DashboardCard
                title="My Orders"
                link="/orders"
                color="bg-green-600"
              />
              <DashboardCard
                title="My Cart"
                link="/cart"
                color="bg-yellow-500"
              />
              <DashboardCard
                title="Settings"
                link="/settings"
                color="bg-indigo-600"
              />
              <DashboardCard
                title="Make a Payment"
                link="/payment"
                color="bg-blue-600"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, link, color }) => (
  <Link
    to={link}
    className={`block ${color} text-white rounded-xl p-4 text-center shadow hover:brightness-110 transition`}
  >
    <span className="font-medium text-lg">{title}</span>
  </Link>
);

export default Dashboard;
