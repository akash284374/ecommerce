import { axiosInstance } from "./authService";


export const addToCart = async (productId) => {
    return axiosInstance.post("/api/user/cart", { productId });
};

export const removeProductFromCart = async (productId) => {
    return axiosInstance.delete(`/api/user/cart/${productId}`)
}

export const decreseQuantityFromCart=async (productId)=>{
    return axiosInstance.put(`/api/user/cart/decrease/${productId}`)
}

export const getCart=async ()=>{
    return axiosInstance.get(`api/user/cart`)
}

export const productAddMessage=async(payload)=>{
    return axiosInstance.post(`/api/products/add`, payload);
}

export const getAdminProduct=async()=>{
    return axiosInstance.get(`/api/products/admin`);
}

export const adminDeleteProduct=async(productId)=>{
    return axiosInstance.delete(`/api/products/admin/${productId}`);
}


