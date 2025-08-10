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
  (config) => {
    if (config.data.token) {
      localStorage.setItem("token", config.data.token)
    }
    return config
  }
)

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
// export const logout = () => {
//   return axiosInstance.get("/api/auth/logout");
// };


// Logout
export const logout = async () => {
  try {
    await axiosInstance.get("/api/auth/logout");
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    localStorage.removeItem("token"); // Clear token locally
  }
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
// export const updateProfile = (data) => {
//   return axiosInstance.put("/api/auth/update-profile", data);
// };

export const updateProfile = (data) => {
  return axiosInstance.put("/api/auth/update-profile", data, {
    headers: { "Content-Type": "application/json" },
  });
};


// Change Password
export const changePassword = (data) => {
  return axiosInstance.put("/api/auth/change-password", data);
};


// Send Forgot Password OTP
export const sendForgotPasswordOtp = (email) => {
  return axiosInstance.post("/api/auth/forgot-password/send-otp", { email });
};

// Verify Forgot Password OTP
export const verifyForgotPasswordOtp = (data) => {
  return axiosInstance.post("/api/auth/forgot-password/verify-otp", data);
  // data = { email, otp }
};

// Reset Password
export const resetPassword = (data) => {
  return axiosInstance.put("/api/auth/forgot-password/reset", data);
  // data = { email, newPassword, confirmPassword }
};


