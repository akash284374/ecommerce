import { axiosInstance } from "./authService"


export const getProducts = async () => {
    return axiosInstance.get("/api/products")
}

export const getAdminOrders=async()=>{
    return axiosInstance.get(`/api/orders/admin`)
}

export const getUserOrders=async()=>{
    return axiosInstance.get(`/api/orders/user`)
}

export const getPaymentHistory=async()=>{
    return axiosInstance.get(`/api/payment/history`)
}

export const paymentHandle=async()=>{
    return axiosInstance.get(`/api/payment/create-order`)
}

export const profileUpdate=async()=>{
    return axiosInstance.put(`/api/auth/update-profile`)
}

export const passwordChange=async()=>{
    return axiosInstance.put(`/api/auth/change-password`)
}

export const paymentSave=()=>{
    return axiosInstance.post(`/api/payment/save`)
}

export const userOrders=()=>{
    return axiosInstance.post(`/api/orders`)
}