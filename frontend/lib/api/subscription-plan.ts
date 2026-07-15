import { getAuthToken } from "../cookie";
import { axiosInstance } from "./axios";
import { API } from "./endpoints";

export const createSubscriptionPlan = async (data:any) => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const res = await axiosInstance.post(API.AUTH.SUBSCRIPTION_PLAN, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}

export const getSubscriptionPlanById = async (id:string) => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const res = await axiosInstance.get(`${API.AUTH.SUBSCRIPTION_PLAN}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}

export const updateSubscriptionPlan = async (id:string, data:any) => {
    const token = await getAuthToken(); 
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const res = await axiosInstance.patch(`${API.AUTH.SUBSCRIPTION_PLAN}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}

export const deleteSubscriptionPlan = async (id:string) => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const res = await axiosInstance.delete(`${API.AUTH.SUBSCRIPTION_PLAN}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}

