import { API } from "./endpoints";
import { getAuthToken } from "../cookie";
import { axiosInstance } from "./axios";

export const createOrder = async(formData:any, shopId:string) => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error('No auth token found');
    }
    const response = await axiosInstance.post(`${API.AUTH.ORDER}/shop/${shopId}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },    });
    return response.data;
    
}

export const getOrderByUserId = async() => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error('No auth token found');
    }
    const response = await axiosInstance.get(`${API.AUTH.ORDER}/user`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const getOrderByShopId = async(shopId:string) => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error('No auth token found');
    }
    const response = await axiosInstance.get(`${API.AUTH.ORDER}/shop/${shopId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const getOrderBySubscriptionId = async(subscriptionId:string) => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error('No auth token found');
    }
    const response = await axiosInstance.get(`${API.AUTH.ORDER}/subscription/${subscriptionId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const getOrderById = async(id:string) => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error('No auth token found');
    }
    const response = await axiosInstance.get(`${API.AUTH.ORDER}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const updateOrder = async(id:string, formData:any) => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error('No auth token found');
    }
    const response = await axiosInstance.patch(`${API.AUTH.ORDER}/${id}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const deleteOrder = async(id:string) => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error('No auth token found');
    }
    const response = await axiosInstance.delete(`${API.AUTH.ORDER}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}