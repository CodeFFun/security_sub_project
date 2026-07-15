import { API } from "./endpoints";
import { axiosInstance } from "./axios";
import { getAuthToken } from "../cookie";


export const createUser = async(userData: any) => {
    try{
        const token = await getAuthToken();
        const response = await axiosInstance.post(`${API.AUTH.ADMIN}/create-users`, userData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message  
            || err.message 
            || "User creation failed" 
        )
    }
}

export const getAllUsers = async() => {
    try{
        const token = await getAuthToken();
        const response = await axiosInstance.get(`${API.AUTH.ADMIN}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message  
            || err.message 
            || "Fetching users failed" 
        )
    }
}

export const updateUser = async(userId: string, userData: FormData) => {
    try{
        const token = await getAuthToken();
        const response = await axiosInstance.patch(`${API.AUTH.ADMIN}/update-users/${userId}`, userData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message  
            || err.message 
            || "User update failed" 
        )
    }
}

export const getUser = async(userId: string) => {
    try{
        console.log(userId)
        const token = await getAuthToken();
        const response = await axiosInstance.get(`${API.AUTH.ADMIN}/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message  
            || err.message 
            || "Fetching user failed" 
        )
    }
}