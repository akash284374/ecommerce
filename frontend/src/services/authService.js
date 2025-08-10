import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Axios instance (optional: easier to maintain headers)
export const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // <-- Add Bearer prefix here
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response;
  }
);

// Auth APIs

export const sendOtp = (email) => {
  return axiosInstance.post("/api/auth/send-otp", { email });
};

export const register = (data) => {
  return axiosInstance.post("/api/auth/register", data);
};

export const login = (data) => {
  return axiosInstance.post("/api/auth/login", data);
};

export const logout = () => {
  return axiosInstance.get("/api/auth/logout");
};

export const getCurrentUser = () => {
  return axiosInstance.get("/api/auth/me");
};

export const verifyOtp = (data) => {
  return axiosInstance.post("/api/auth/verify-otp", data);
};

export const updateProfile = (data) => {
  return axiosInstance.put("/api/auth/update-profile", data, {
    headers: { "Content-Type": "application/json" },
  });
};

export const changePassword = (data) => {
  return axiosInstance.put("/api/auth/change-password", data);
};

// Other APIs

export const getProducts = async () => {
  return axiosInstance.get("/api/products");
};

export const getAdminOrders = async () => {
  return axiosInstance.get("/api/orders/admin");
};

export const getUserOrders = async () => {
  return axiosInstance.get("/api/orders/user");
};

export const getPaymentHistory = async () => {
  return axiosInstance.get("/api/payment/history");
};

export const paymentHandle = async (amount) => {
  return axiosInstance.post("/api/payment/create-order", { amount });
};

export const profileUpdate = async (payload) => {
  return axiosInstance.put("/api/auth/update-profile", payload);
};

export const passwordChange = async (payload) => {
  return axiosInstance.put("/api/auth/change-password", payload);
};

export const paymentSave = (details) => {
  return axiosInstance.post("/api/payment/save", details);
};

export const userOrders = (details) => {
  return axiosInstance.post("/api/orders", details);
};
