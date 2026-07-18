import { createOrderItem, deleteOrderItem, getOrderItems, updateOrderItem } from "../api/order-item";

export const handleCreateOrderItem = async (formData: any) => {
  try {
    const res = await createOrderItem(formData);
    if (res.success) {
      return {
        success: true,
        data: res.data,
        message: "Order item created successfully",
      };
    }
    return {
      success: false,
      data: null,
      message: res.message || "Failed to create order item",
    };
  }
    catch (error: Error | any) {
    return {
      success: false,
      data: null,
        message: error.message || "Failed to create order item",
    };
  }
};

export const handleGetOrderItems = async (id: string) => {
  try {
    const res = await getOrderItems(id);
    if (res.success) {
      return {
        success: true,
        data: res.data,
        message: "Order items retrieved successfully",
      };
    }
    return {
      success: false,
      data: null,
      message: res.message || "Failed to retrieve order items",
    };
  }
    catch (error: Error | any) {
    return {
      success: false,
      data: null,
        message: error.message || "Failed to retrieve order items",
    };
  }
};

export const handleUpdateOrderItem = async (id: string, formData: any) => {
  try {
    const res = await updateOrderItem(id, formData);
    if (res.success) {
      return {
        success: true,
        data: res.data,
        message: "Order item updated successfully",
      };
    }
    return {
      success: false,
      data: null,
        message: res.message || "Failed to update order item",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      data: null,
        message: error.message || "Failed to update order item",
    };
  }
};

export const handleDeleteOrderItem = async (id: string) => {
    try {
        const res = await deleteOrderItem(id);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Order item deleted successfully",
            };
        }
        return {
            success: false,
            data: null,
            message: res.message || "Failed to delete order item",
        };
    }
    catch (error: Error | any) {        return {
            success: false,
            data: null,
            message: error.message || "Failed to delete order item",
        };
    }
};