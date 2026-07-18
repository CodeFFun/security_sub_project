import {
  createSubscription,
  deleteSubscription,
  getAllSubscriptionOfAShop,
  getAllSubscriptionOfAUser,
  getSubscriptionById,
  updateSubscription,
} from "../api/subscription";

export const handleCreateSubscription = async (shopId: string, data: any) => {
  try {
    const res = await createSubscription(shopId, data);
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
  } catch (err) {
    return {
      success: false,
      data: null,
      message: "An error occurred while creating the subscription.",
    };
  }
};

export const handleGetAllSubscriptionOfAUser = async () => {
  try {
    const res = await getAllSubscriptionOfAUser();
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
  } catch (err) {
    return {
      success: false,
      data: null,
      message: "An error occurred while fetching subscriptions.",
    };
  }
};

export const handleGetAllSubscriptionOfAShop = async (shopId: string) => {
  try {
    const res = await getAllSubscriptionOfAShop(shopId);
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
  } catch (err) {
    return {
      success: false,
      data: null,
      message: "An error occurred while fetching subscriptions.",
    };
  }
};

export const handleGetSubscriptionById = async (id: string) => {
  try {
    const res = await getSubscriptionById(id);
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
  } catch (err) {
    return {
      success: false,
      data: null,
      message: "An error occurred while fetching the subscription.",
    };
  }
};

export const handleUpdateSubscription = async (id: string, data: any) => {
  try {
    const res = await updateSubscription(id, data);
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
  } catch (err) {
    return {
      success: false,
      data: null,
      message: "An error occurred while updating the subscription.",
    };
  }
};

export const handleDeleteSubscription = async (id: string) => {
  try {
    const res = await deleteSubscription(id);
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
  } catch (err) {
    return {
      success: false,
      data: null,
      message: "An error occurred while deleting the subscription.",
    };
  }
};
