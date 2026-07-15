import { API } from "./endpoints";
import { axiosInstance } from "./axios";
import { getAuthToken } from "../cookie";

export const createShopCategory = async (formData:any) => {
    try {
        const token = await getAuthToken();
        const response = await axiosInstance.post(`${API.AUTH.SHOP_CATEGORY}/create`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error : Error | any) {
        console.error('Error creating shop category:', error);
        throw new Error(
            error.response?.data?.message || 
            error.message || 
            "Failed to create shop category"
        );
    }
}
export const getAllShopCategory = async () => {
    try {
        const token = await getAuthToken();
        const response = await axiosInstance.get(`${API.AUTH.SHOP_CATEGORY}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: Error | any) {
        console.error('Error fetching shop categories:', error);
        throw new Error(
            error.response?.data?.message || 
            error.message || 
            "Failed to create shop category"
        );
    }
}
export const getShopCategoryById = async (id: string) => {
    try {
        const token = await getAuthToken();
        const response = await axiosInstance.get(`${API.AUTH.SHOP_CATEGORY}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: Error | any) {
        console.error('Error fetching shop category by ID:', error);
        throw new Error(
            error.response?.data?.message || 
            error.message || 
            "Failed to fetch shop category by ID"
        );
   
    }
}

export const updateShopCategory = async (id: string, formData: any) => {
    try {
        const token = await getAuthToken();
        const response = await axiosInstance.put(`${API.AUTH.SHOP_CATEGORY}/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: Error | any) {
        console.error('Error updating shop category by ID:', error);
        throw new Error(
            error.response?.data?.message || 
            error.message || 
            "Failed to update shop category"
        );
    }
}

export const deleteShopCategory = async (id: string) => {
    try {
        const token = await getAuthToken();
        const response = await axiosInstance.delete(`${API.AUTH.SHOP_CATEGORY}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: Error | any) {
        console.error('Error deleting shop category by ID:', error);
        throw new Error(
            error.response?.data?.message || 
            error.message || 
            "Failed to delete shop category"
        );
    }
}



