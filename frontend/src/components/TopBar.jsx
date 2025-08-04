import React from "react";
import { MapPin, Search, ShoppingCart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md sticky top-0 z-50">
      {/* Left: Location */}
      <div className="flex items-center gap-2">
        <MapPin className="text-black" size={18} />
        <div className="text-sm">
          <p className="text-gray-500 text-xs">Address</p>
          <p className="font-medium text-black">Uttara, Dhaka</p>
        </div>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/search")}>
          <Search className="text-black" size={20} />
        </button>
        <button onClick={() => navigate("/cart")}>
          <ShoppingCart className="text-black" size={20} />
        </button>
        <button onClick={() => navigate("/dashboard")}>
          <User className="text-black" size={20} />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
