import { API } from "./endpoints";
import { axiosInstance } from "./axios";
import { getAuthToken } from "../cookie";

export const createProduct = async (shopId: string, productData: any) => {
    try{
        const token = await getAuthToken();
        const res = await axiosInstance.post(`${API.AUTH.PRODUCT}/shop/${shopId}`, productData,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })
        return res.data;
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message  
            || err.message 
            || "Product creation failed"
            )
    }
}

export const getProductByShopId = async (shopId: string) => {
    try{
        const token = await getAuthToken();
        const res = await axiosInstance.get(`${API.AUTH.PRODUCT}/shop/${shopId}`,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })
        return res.data;
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message  
            || err.message 
            || "Failed to fetch products"
            )
    }
}

export const getProductByShopName = async (shopId: string, name:string) => {
    try{
        const token = await getAuthToken();
        const res = await axiosInstance.get(`${API.AUTH.PRODUCT}/shop/${shopId}?name=${name}`,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })
        return res.data;
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message  
            || err.message 
            || "Failed to fetch products"
            )
    }
}

export const getProductById = async (productId: string) => {
    try{
        const token = await getAuthToken();
        const res = await axiosInstance.get(`${API.AUTH.PRODUCT}/${productId}`,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })
        return res.data;
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message  
            || err.message 
            || "Failed to fetch product"
            )
    }
}

export const updateProduct = async (productId:string, productData:any) => {
    try{
        const token = await getAuthToken();
        const res = await axiosInstance.patch(`${API.AUTH.PRODUCT}/${productId}`,productData,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })
        return res.data;
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message  
            || err.message 
            || "Failed to update product"
            )
    }
}

export const deleteProduct = async (productId: string) => {
    try{
        const token = await getAuthToken();
        const res = await axiosInstance.delete(`${API.AUTH.PRODUCT}/${productId}`,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })
        return res.data;
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message  
            || err.message 
            || "Failed to delete product"
            )
    }
}

