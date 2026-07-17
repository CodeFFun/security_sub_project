import { createProduct, deleteProduct, getProductById, getProductByShopId, updateProduct } from "../api/product";

export const handleCreateProduct = async (shopId: string, productData: any) => {
    try {
        const res = await createProduct(shopId, productData)
        if(res.success){
            return {
                success: true,
                data: res.data,
                message:"Product created successfully"
            }
        }
        return { success: false, message: res.message || "Product creation failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Product creation failed" };
    }
}

export const handleGetProductsByShopId = async (shopId: string) => {
    try {
        const res = await getProductByShopId(shopId)
        if(res.success){
            return {
                success: true,
                data: res.data,
                message:"Product retrieved successfully"
            }
        }
        return { success: false, message: res.message || "Product retrieval failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Product retrieval failed" };
    }
}

export const handleGetProductByShopName = async (shopId: string, name: string) => {
    try {
        const res = await createProduct(shopId, name)
        if(res.success){
            return {
                success: true,
                data: res.data,
                message:"Product retrieved successfully"
            }
        }
        return { success: false, message: res.message || "Product retrieval failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Product retrieval failed" };
    }
}

export const handleGetProductById = async (productId: string) => {
    try {
        const res = await getProductById(productId)
        if(res.success){
            return {
                success: true,
                data: res.data,
                message:"Product retrieved successfully"
            }
        }
        return { success: false, message: res.message || "Product retrieval failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Product retrieval failed" };
    }
}

export const handleUpdateProduct = async (productId: string, formData: any) => {
    try {
        const res = await updateProduct(productId, formData)
        if(res.success){
            return {
                success: true,
                data: res.data,
                message:"Product updated successfully"
            }
        }
        return { success: false, message: res.message || "Product update failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Product update failed" };
    }
}

export const handleDeleteProduct = async (productId: string) => {
    try {
        const res = await deleteProduct(productId)
        if(res.success){
            return {
                success: true,
                data: res.data,
                message:"Product deleted successfully"
            }
        }
        return { success: false, message: res.message || "Product deletion failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Product deletion failed" };
    }
}