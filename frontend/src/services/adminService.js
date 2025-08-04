import { axiosInstance } from "./authService";

// ✅ Fetch all users (admin only)
export const fetchAllUsers = () => {
  return axiosInstance.get("/api/auth/admin/users");
};
