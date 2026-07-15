import { getAuthToken } from "../cookie";
import { axiosInstance } from "./axios";
import { API } from "./endpoints";

export const createSubscription = async(shopId:string, data:any) => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const res = await axiosInstance.post(`${API.AUTH.SUBSCRIPTION}/shop/${shopId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}

export const getAllSubscriptionOfAUser = async() => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const res = await axiosInstance.get(`${API.AUTH.SUBSCRIPTION}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}
export const getAllSubscriptionOfAShop = async(shopId:string) => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const res = await axiosInstance.get(`${API.AUTH.SUBSCRIPTION}/shop/${shopId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}



export const getSubscriptionById = async (id:string) => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const res = await axiosInstance.get(`${API.AUTH.SUBSCRIPTION}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}

export const updateSubscription = async (id:string, data:any) => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const res = await axiosInstance.patch(`${API.AUTH.SUBSCRIPTION}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}

export const deleteSubscription = async (id:string) => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const res = await axiosInstance.delete(`${API.AUTH.SUBSCRIPTION}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}