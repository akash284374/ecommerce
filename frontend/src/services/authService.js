import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Axios instance (optional: easier to maintain headers)
const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true,
});

// Send OTP
export const sendOtp = (email) => {
  return axiosInstance.post("/api/auth/send-otp", { email });
};

// Register with OTP
export const register = (data) => {
  return axiosInstance.post("/api/auth/register", data);
};

// Login
export const login = (data) => {
  return axiosInstance.post("/api/auth/login", data);
};

// Logout
export const logout = () => {
  return axiosInstance.get("/api/auth/logout");
};

// Get Current User
export const getCurrentUser = () => {
  return axiosInstance.get("/api/auth/me");
};

// Verify OTP
export const verifyOtp = (data) => {
  return axiosInstance.post("/api/auth/verify-otp", data);
};

// Update Profile
export const updateProfile = (data) => {
  return axiosInstance.put("/api/auth/update-profile", data);
};

// Change Password
export const changePassword = (data) => {
  return axiosInstance.put("/api/auth/change-password", data);
};

