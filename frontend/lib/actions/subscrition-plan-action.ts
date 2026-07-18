import {
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
} from "../api/subscription-plan";

export const handleCreateSubscriptionPlan = async (data: any) => {
  try {
    const res = await createSubscriptionPlan(data);
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
      message: "An error occurred while creating the subscription plan.",
    };
  }
};

export const handleUpdateSubscriptionPlan = async (id: string, data: any) => {
  try {
    const res = await updateSubscriptionPlan(id, data);
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
      message: "An error occurred while updating the subscription plan.",
    };
  }
};

export const handleDeleteSubscriptionPlan = async (id: string) => {
  try {
    const res = await deleteSubscriptionPlan(id);
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
      message: "An error occurred while deleting the subscription plan.",
    };
  }
};

export const handleGetSubscriptionPlanById = async (id: string) => {
  try {
    const res = await getSubscriptionPlanById(id);
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
      message: "An error occurred while fetching the subscription plan.",
    };
  }
};
