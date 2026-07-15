import { getAuthToken } from "../cookie";
import { API } from "./endpoints";
import { axiosInstance } from "./axios";

export const getDashboardData = async () => {
    const token = await getAuthToken();
    const res = await axiosInstance.get(`${API.AUTH.DASHBOARD}/shop/overview`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};
