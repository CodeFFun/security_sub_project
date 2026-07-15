import { getAuthToken } from "../cookie";
import { axiosInstance } from "./axios";
import { API } from "./endpoints";

export const createDelivery = async (delivery: any) => {
  try {
    const token = await getAuthToken();
    const response = await axiosInstance.post(API.AUTH.DELIVERY, delivery, {
      headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating delivery:", error);
    throw error;
  }
};

export const getDelivery = async (deliveryId: string) => {
  try {
    const token = await getAuthToken();
    const response = await axiosInstance.get(`${API.AUTH.DELIVERY}/${deliveryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting delivery:", error);
    throw error;
  }
};

export const getDeliveryByOrderId = async (orderId: string) => {
  try {
    const token = await getAuthToken();
    const response = await axiosInstance.get(`${API.AUTH.DELIVERY}/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting delivery by order ID:", error);
    throw error;
  }
};

export const updateDeliveryStatus = async (deliveryId: string, updateData: any) => {
  try {
    const token = await getAuthToken();
    const response = await axiosInstance.patch(`${API.AUTH.DELIVERY}/${deliveryId}/status`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating delivery status:", error);
    throw error;
  }
};

export const deleteDelivery = async (deliveryId: string) => {
    try {
        const token = await getAuthToken();
        const response = await axiosInstance.delete(`${API.AUTH.DELIVERY}/${deliveryId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("Error deleting delivery:", error);
        throw error;
    }
}