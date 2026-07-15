import { API } from "./endpoints";
import { getAuthToken } from "../cookie";
import { axiosInstance } from "./axios";

export const createOrderItem = async(formData:any) => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error('No auth token found');
    }
    const response = await axiosInstance.post(API.AUTH.ORDER_ITEM, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const getOrderItems = async(id:string) => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error('No auth token found');
    }
    const response = await axiosInstance.get(`${API.AUTH.ORDER_ITEM}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const updateOrderItem = async(id:string, formData:any) => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error('No auth token found');
    }
    const response = await axiosInstance.patch(`${API.AUTH.ORDER_ITEM}/${id}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const deleteOrderItem = async(id:string) => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error('No auth token found');
    }
    const response = await axiosInstance.delete(`${API.AUTH.ORDER_ITEM}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

