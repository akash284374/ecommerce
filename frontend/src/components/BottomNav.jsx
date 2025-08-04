import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Heart,
  User,
} from "lucide-react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <Home />, label: "Home", path: "/" },
    { icon: <FileText />, label: "Orders", path: "/admin/orders" }, // or "/orders" for users
    { icon: <Heart />, label: "Wishlist", path: "/wishlist" }, // implement this later
    { icon: <User />, label: "Profile", path: "/dashboard" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md flex justify-around items-center h-14 z-50">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`flex flex-col items-center text-sm ${
            location.pathname === item.path ? "text-blue-600" : "text-gray-500"
          }`}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
