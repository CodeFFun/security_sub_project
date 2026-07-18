import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrderByShopId,
  getOrderBySubscriptionId,
  getOrderByUserId,
  updateOrder,
} from "../api/order";

export const handleCreateOrder = async (shopId: string, formData: any) => {
  try {
    const res = await createOrder(formData, shopId);
    if (res.success) {
      return {
        success: true,
        data: res.data,
        message: "Order created successfully",
      };
    }
    return {
      success: false,
      data: null,
      message: res.message || "Failed to create order",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      data: null,
      message: error.message || "Failed to create order",
    };
  }
};

export const handleGetOrderByUserId = async () => {
  try {
    const res = await getOrderByUserId();
    if (res.success) {
      return {
        success: true,
        data: res.data,
        message: "Orders retrieved successfully",
      };
    }
    return {
      success: false,
      data: null,
      message: res.message || "Failed to retrieve orders",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      data: null,
      message: error.message || "Failed to retrieve orders",
    };
  }
};

export const handleGetOrderByShopId = async (shopId: string) => {
  try {
    const res = await getOrderByShopId(shopId);
    if (res.success) {
      return {
        success: true,
        data: res.data,
        message: "Orders retrieved successfully",
      };
    }
    return {
      success: false,
      data: null,
      message: res.message || "Failed to retrieve orders",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      data: null,
      message: error.message || "Failed to retrieve orders",
    };
  }
};

export const handleGetOrderById = async (id: string) => {
  try {
    const res = await getOrderById(id);
    if (res.success) {
      return {
        success: true,
        data: res.data,
        message: "Order retrieved successfully",
      };
    }
    return {
      success: false,
      data: null,
      message: res.message || "Failed to retrieve order",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      data: null,
      message: error.message || "Failed to retrieve order",
    };
  }
};

export const handleGetOrderBySubscriptionId = async (
  subscriptionId: string,
) => {
  try {
    const res = await getOrderBySubscriptionId(subscriptionId);
    if (res.success) {
      return {
        success: true,
        data: res.data,
        message: "Orders retrieved successfully",
      };
    }
    return {
      success: false,
      data: null,
      message: res.message || "Failed to retrieve orders",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      data: null,
      message: error.message || "Failed to retrieve orders",
    };
  }
};

export const handleUpdateOrder = async (id: string, formData: any) => {
  try {
    const res = await updateOrder(id, formData);
    if (res.success) {
      return {
        success: true,
        data: res.data,
        message: "Order updated successfully",
      };
    }
    return {
      success: false,
      data: null,
      message: res.message || "Failed to update order",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      data: null,
      message: error.message || "Failed to update order",
    };
  }
};

export const handleDeleteOrder = async (id: string) => {
  try {
    const res = await deleteOrder(id);
    if (res.success) {
      return {
        success: true,
        data: res.data,
        message: "Order deleted successfully",
      };
    }
    return {
      success: false,
      data: null,
      message: res.message || "Failed to delete order",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      data: null,
      message: error.message || "Failed to delete order",
    };
  }
};
