import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// ✅ Axios instance
const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true,
});

// ✅ Fetch all users (admin only)
export const fetchAllUsers = () => {
  return axiosInstance.get("/api/auth/admin/users");
};
