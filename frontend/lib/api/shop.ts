import { API } from "./endpoints";
import { getAuthToken } from "../cookie";
import { axiosInstance } from "./axios";

export const createShop  = async (formData:FormData) => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("No auth token found");
    }
    try {        
        const response = await axiosInstance.post(`${API.AUTH.SHOP}/create`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {       
         console.error("Error creating shop:", error);
        throw error;
    }
};

export const getShopsById  = async (id: string) => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("No auth token found");
    }
    try {        
        const response = await axiosInstance.get(`${API.AUTH.SHOP}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {       
        console.error("Error getting shop:", error);
        throw error;
    }
};

export const getAllShopsOfAUser  = async () => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("No auth token found");
    }
    try {        
        const response = await axiosInstance.get(`${API.AUTH.SHOP}/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {        
        console.error("Error getting shops of a user:", error);
        throw error;
    }
};

export const getAllShops  = async () => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("No auth token found");
    }
    try {        
        const response = await axiosInstance.get(`${API.AUTH.SHOP}/all`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("Error getting all shops:", error);
        throw error;
    }
};

export const updateShop  = async (id:string, formData:FormData) => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("No auth token found");
    }
    try {        
        const response = await axiosInstance.patch(`${API.AUTH.SHOP}/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {        
        console.error("Error updating shop:", error);
        throw error;
    }
};

export const deleteShop  = async (id:string) => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("No auth token found");
    }
    try {
        const response = await axiosInstance.delete(`${API.AUTH.SHOP}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("Error deleting shop:", error);
        throw error;
    }
};
