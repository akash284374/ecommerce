import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { passwordChange, profileUpdate } from "../services/productService";
import toast from "react-hot-toast";

const Settings = () => {
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        oldPassword: "",
        newPassword: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await profileUpdate({
        name: formData.name,
        username: formData.username,
      });
      toast.success("✅ Profile updated!");
      refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    const { oldPassword, newPassword } = formData;

    if (!oldPassword || !newPassword) {
      return toast.error("Please fill both password fields");
    }

    try {
      await passwordChange({ oldPassword, newPassword });
      toast.success("✅ Password changed!");

      // Clear password fields only
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0f172a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Profile Update */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <span className="text-purple-600 dark:text-purple-400">👤</span> Update Profile
          </h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-3 rounded border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full p-3 rounded border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
            >
              Update Info
            </button>
          </form>
        </div>

        {/* Password Change */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <span className="text-orange-500 dark:text-yellow-400">🔒</span> Change Password
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <input
              name="oldPassword"
              type="password"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Old Password"
              className="w-full p-3 rounded border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="New Password"
              className="w-full p-3 rounded border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
