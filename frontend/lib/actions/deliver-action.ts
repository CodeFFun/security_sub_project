import { createDelivery, deleteDelivery, getDelivery, getDeliveryByOrderId, updateDeliveryStatus } from "../api/deliver";

export const handleCreateDelivery = async (deliveryData: any) => {
  try {
    const res = await createDelivery(deliveryData);
    if (res.success) {
      return {
        success: true,
        data: res.data,
        message: res.message,
      };
    }
    return {
      success: false,
      data: null,
      message: res.message,
    };
  } catch (error) {
    console.error("Error in handleCreateDelivery:", error);
    return {
        success: false,
        data: null,
        message: "An error occurred while creating delivery.",
    };
  }
};

export const handleGetDelivery = async (deliveryId: string) => {
    try {
        const res = await getDelivery(deliveryId);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: res.message,
            };
        }
        return {
            success: false,
            data: null,
            message: res.message,
        };
    }
    catch (error) {
        console.error("Error in handleGetDelivery:", error);
        return {
            success: false,
            data: null,
            message: "An error occurred while fetching delivery.",
        };
    }
}

export const handleGetDeliveryByOrderId = async (orderId: string) => {
    try {
        const res = await getDeliveryByOrderId(orderId);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: res.message,
            };
        }
        return {
            success: false,
            data: null,
            message: res.message,
        };
    }
    catch (error) {
        console.error("Error in handleGetDeliveryByOrderId:", error);
        return {
            success: false,
            data: null,
            message: "An error occurred while fetching delivery by order ID.",
        };
    }
}

export const handleUpdateDeliveryStatus = async (deliveryId: string, updateData: any) => {
  try {
    const res = await updateDeliveryStatus(deliveryId, updateData);
    if (res.success) {
      return {
        success: true,
        data: res.data,
        message: res.message,
      };
    }
    return {
      success: false,
      data: null,
      message: res.message,
    };
  }
    catch (error) {
    console.error("Error in handleUpdateDeliveryStatus:", error);
    return {
      success: false,
      data: null,
      message: "An error occurred while updating delivery status.",
    };
  }
};

export const handleDeleteDelivery = async (deliveryId: string) => {
    try{
        const res = await deleteDelivery(deliveryId);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: res.message,
            };
        }
        return {
            success: false,
            data: null,
            message: res.message,
        };
    }catch (error) {
        console.error("Error in handleDeleteDelivery:", error);
        return {
            success: false,
            data: null,
            message: "An error occurred while deleting delivery.",
        };
    }
}