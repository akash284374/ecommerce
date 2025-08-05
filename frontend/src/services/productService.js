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

export const paymentHandle=async(amount)=>{
    return axiosInstance.post(`/api/payment/create-order`,{amount})
}

export const profileUpdate=async()=>{
    return axiosInstance.put(`/api/auth/update-profile`)
}

export const passwordChange=async(payload)=>{
    return axiosInstance.put(`/api/auth/change-password`,payload)
}

export const paymentSave=(details)=>{
    return axiosInstance.post(`/api/payment/save`,details)
}

export const userOrders=(details)=>{
    return axiosInstance.post(`/api/orders`,details)
}