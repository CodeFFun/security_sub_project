import { getProductCategoriesByShopId,createProductCategory, deleteProductCategory, getAllProductCategories, getProductCategoryById, updateProductCategory } from "../api/product-category";

export const handleCreateProductCategory = async (formData:any) => {
    try {
        const res = await createProductCategory(formData);
        if(res.success){
            return{
                success: true,
                message: res.message,
                data: res.data
            }
        }
        return{success: false, message: res.message}
    } catch (error: Error | any) {
        return {
            success: false,
            message: error || "An error occurred while creating the product category."
        }
    }
}

export const handleGetAllProductCategories = async () => {
    try {
        const res = await getAllProductCategories();
        if(res.success){
            return{
                success: true,
                message: res.message,
                data: res.data
            }
        }
        return{success: false, message: res.message}
    } catch (error: Error | any) {
        return {
            success: false,
            message: error || "An error occurred while fetching the product categories."
        }
    }
}

export const handleGetProductCategoryById = async (categoryId:string) => {
    try {
        const res = await getProductCategoryById(categoryId);
        if(res.success){
            return{
                success: true,
                message: res.message,
                data: res.data
            }
        }
        return{success: false, message: res.message}
    } catch (error: Error | any) {
        return {
            success: false,
            message: error || "An error occurred while fetching the product category."
        }
    }
}

export const handleGetAllProductCategoriesOfAShop = async (shopId:string) => {
    try {
        const res = await getProductCategoriesByShopId(shopId);
        if(res.success){
            return{
                success: true,
                message: res.message,
                data: res.data
            }
        }
        return{success: false, message: res.message}
    } catch (error: Error | any) {
        return {
            success: false,
            message: error || "An error occurred while fetching the product categories of the shop."
        }
    }
}

export const handleupdateProductCategory= async (categoryId:string, formData:any) => {
    try {
        const res = await updateProductCategory(categoryId, formData);
        if(res.success){
            return{
                success: true,
                message: res.message,
                data: res.data
            }
        }
        return{success: false, message: res.message}
    } catch (error: Error | any) {
        return {
            success: false,
            message: error.response?.data?.message || "An error occurred while updating the product category."
        }
    }
}

export const handleDeleteProductCategory = async (categoryId:string) => {
    try {
        const res = await deleteProductCategory(categoryId);
        if(res.success){
            return{
                success: true,
                message: res.message,
                data: res.data
            }
        }
        return{success: false, message: res.message}
    } catch (error: Error | any) {
        return {
            success: false,
            message: error.response?.data?.message || "An error occurred while deleting the product category."
        }
    }
}


        