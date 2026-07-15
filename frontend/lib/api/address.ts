import { API } from "./endpoints";
import { axiosInstance } from "./axios";
import { getAuthToken } from "../cookie";


export const createAddress = async(addressData:any) => {
    try{
        const token = await getAuthToken();
        const res = await axiosInstance.post(API.AUTH.ADDRESS, addressData,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })
        return res.data;
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message  
            || err.message 
            || "Address creation failed" 
        )
    }
}

export const getAllAddressOfAUser = async() => {
    try{
        const token = await getAuthToken();
        const res = await axiosInstance.get(API.AUTH.ADDRESS,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })
        return res.data;
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message  
            || err.message 
            || "Failed to fetch addresses" 
        )
    }
}

export const getAddressById = async(id: string) => {
    try{
        const token = await getAuthToken();
        const res = await axiosInstance.get(`${API.AUTH.ADDRESS}/${id}`,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })
        return res.data;
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message  
            || err.message 
            || "Failed to fetch address" 
        )
    }
}

export const updateAddress = async(id: string, addressData:any) => {
    try{
        const token = await getAuthToken();
        const res = await axiosInstance.patch(`${API.AUTH.ADDRESS}/${id}`,addressData,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })
        return res.data;
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message  
            || err.message 
            || "Failed to update address" 
        )
    }
}

export const deleteAddress = async(id: string, addressData:any) => {
    try{
        const token = await getAuthToken();
        const res = await axiosInstance.delete(`${API.AUTH.ADDRESS}/${id}`,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })
        return res.data;
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message  
            || err.message 
            || "Failed to delete address" 
        )
    }
}