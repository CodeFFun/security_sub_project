import { createShopCategory, deleteShopCategory, getAllShopCategory, getShopCategoryById, updateShopCategory } from "../api/shop-category";

export const handleCreateShopCategory = async (formData: any) => {
    try {
        const res = await createShopCategory(formData);
        if(res.success){
            return{
                success: true,                
                message: "Category created successfully",
                data: res.data
            }
        }
        return{
            success: false,
            message: res.message || "Failed to create category"
        }
    } catch (error) {
        console.error('Error handling create shop category:', error);
        return {
            success: false,
            message: "An error occurred while creating the category"
        }
    }
}

export const handleGetAllShopCategory = async () => {
    try {
        const res = await getAllShopCategory();
        if(res.success){
            return{
                success: true,
                message: "Categories fetched successfully",
                data: res.data
            }
        }
        return{
            success: false,
            message: res.message || "Failed to fetch categories"
        }
    } catch (error) {
        console.error('Error handling get all shop categories:', error);
        return {
            success: false,
            message: "An error occurred while fetching the categories"
        }
    }
}

export const handleGetShopCategoryById = async (id: string) => {
    try {
        const res = await getShopCategoryById(id);
        if(res.success){
            return{
                success: true,
                message: "Category fetched successfully",
                data: res.data
            }
        }
        return{
            success: false,
            message: res.message || "Failed to fetch category"
        }
    }
        catch (error) {
        console.error('Error handling get shop category by ID:', error);
        return {
            success: false,
            message: "An error occurred while fetching the category"
        }
    }
}

export const handleUpdateShopCategory = async (id: string, formData: any) => {
    try {
        const res = await updateShopCategory(id, formData);
        if(res.success){
            return{
                success: true,
                message: "Category updated successfully",
                data: res.data
            }
        }
        return{
            success: false,
            message: res.message || "Failed to update category"
        }
    } catch (error) {
        console.error('Error handling update shop category:', error);
        return {
            success: false,
            message: "An error occurred while updating the category"
        }
    }
}

export const handleDeleteShopCategory = async (id: string) => {
    try {
        const res = await deleteShopCategory(id);
        if(res.success){
            return{
                success: true,
                message: "Category deleted successfully",
                data: res.data
            }
        }
        return{
            success: false,
            message: res.message || "Failed to delete category"
        }
    }
        catch (error) {
        console.error('Error handling delete shop category:', error);
        return {
            success: false,
            message: "An error occurred while deleting the category"
        }
    }
}