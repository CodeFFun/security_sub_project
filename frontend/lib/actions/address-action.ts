import { createAddress, deleteAddress, getAddressById, getAllAddressOfAUser, updateAddress } from "../api/address";

export const  handleCreateAddress = async (formData: any) => {
    try {
        
        const res = await createAddress(formData);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Address created successfully"
            };
        }
        return { success: false, message: res.message || "Address creation failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Address creation failed" };
    }
}

export const handleGetAllAddressOfAUser= async () => {
    try {
        const res = await getAllAddressOfAUser();
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Addresses fetched successfully"
            };
        }
        return { success: false, message: res.message || "Fetching addresses failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Fetching addresses failed" };
    }
}

export const handleGetAddressById = async (addressId: string) => {
    try {
        const res = await getAddressById(addressId);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Address fetched successfully"
            };
        }
        return { success: false, message: res.message || "Fetching address failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Fetching address failed" };
    }
}

export const handleUpdateAddress = async ( addressId:string, formData: any) => {
    try {
        const res = await updateAddress(addressId, formData);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Address updated successfully"
            };
        }
        return { success: false, message: res.message || "Address update failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Address update failed" };
    }
}

export const handleDeleteAddress = async ( addressId:string) => {
    try {
        const res = await deleteAddress(addressId);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Address deleted successfully"
            };
        }
        return { success: false, message: res.message || "Address delete failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Address delete failed" };
    }
}
