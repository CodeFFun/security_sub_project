import {
  createPayment,
  deletePayment,
  getPayment,
  getPaymentByOrderId,
  getPaymentsByUserId,
  getPaymentsOfShop,
  updatePaymentStatus,
  esewaPayment
} from "../api/payment";

export const handleCreatePayment = async (payment: any) => {
  try {
    const res = await createPayment(payment);
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
    console.error("Error in handleCreatePayment:", error);
    return {
      success: false,
      data: null,
      message: "An error occurred while creating payment.",
    };
  }
};

export const handleGetPayment = async (paymentId: string) => {
  try {
    const res = await getPayment(paymentId);
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
    console.error("Error in handleGetPayment:", error);
    return {
      success: false,
      data: null,
      message: "An error occurred while fetching payment.",
    };
  }
};

export const handleGetPaymentByOrderId = async (orderId: string) => {
  try {
    const res = await getPaymentByOrderId(orderId);
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
    console.error("Error in handleGetPaymentByOrderId:", error);
    return {
      success: false,
      data: null,
      message: "An error occurred while fetching payment by order ID.",
    };
  }
};

export const handleGetPaymentsByUserId = async () => {
  try {
    const res = await getPaymentsByUserId();
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
    console.error("Error in handleGetPaymentsByUserId:", error);
    return {
      success: false,
      data: null,
      message: "An error occurred while fetching payments by user ID.",
    };
  }
};

export const handleGetPaymentsOfShop = async () => {
  try {
    const res = await getPaymentsOfShop();
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
    console.error("Error in handleGetPaymentsOfShop:", error);
    return {
      success: false,
      data: null,
      message: "An error occurred while fetching payments of shop.",
    };
  }
};

export const handleUpdatePaymentStatus = async (
  paymentId: string,
  updateData: any,
) => {
  try {
    const res = await updatePaymentStatus(paymentId, updateData);
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
    console.error("Error in handleUpdatePaymentStatus:", error);
    return {
      success: false,
      data: null,
      message: "An error occurred while updating payment status.",
    };
  }
};

export const handleDeletePayment = async (paymentId: string) => {
  try {
    const res = await deletePayment(paymentId);
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
    console.error("Error in handleDeletePayment:", error);
    return {
      success: false,
      data: null,
      message: "An error occurred while deleting payment.",
    };
  }
};

export const handleEsewaPayment = async (payment: any) => {
  try {
    const res = await esewaPayment(payment);
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
    console.error("Error in handleEsewaPayment:", error);
    return {
      success: false,
      data: null,
      message: "An error occurred while processing eSewa payment.",
    };
  }
}
