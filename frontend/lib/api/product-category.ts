import { API } from "./endpoints";
import { axiosInstance } from "./axios";
import { getAuthToken } from "../cookie";

export const createProductCategory = async(formData:any) => {
    try{
        const token = await getAuthToken();
        const res = await axiosInstance.post(`${API.AUTH.PRODUCT_CATEGORY}/create`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error creating product category:", error);
        throw error;
    }
}

export const getAllProductCategories = async() => {
    try{
        const token = await getAuthToken();
        const res = await axiosInstance.get(`${API.AUTH.PRODUCT_CATEGORY}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching product categories:", error);
        throw error;
    }
}

export const getProductCategoryById = async(categoryId:string) => {
    try{
        const token = await getAuthToken();
        const res = await axiosInstance.get(`${API.AUTH.PRODUCT_CATEGORY}/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching product category by ID:", error);
        throw error;
    }
}

export const updateProductCategory = async(categoryId:string, formData:any) => {
    try{
        const token = await getAuthToken();
        const res = await axiosInstance.patch(`${API.AUTH.PRODUCT_CATEGORY}/${categoryId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error updating product category:", error);
        throw error;
    }
}

export const getProductCategoriesByShopId = async(shopId:string) => {
    try{
        const token = await getAuthToken();
        const res = await axiosInstance.get(`${API.AUTH.PRODUCT_CATEGORY}/shop/${shopId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching product categories by shop ID:", error);
        throw error;
    }
}

export const deleteProductCategory = async(categoryId:string) => {
    try{
        const token = await getAuthToken();
        const res = await axiosInstance.delete(`${API.AUTH.PRODUCT_CATEGORY}/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error deleting product category:", error);
        throw error;
    }
}