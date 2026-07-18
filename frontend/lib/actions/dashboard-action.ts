import { getDashboardData } from "../api/dashboard";

export const handleDashboardData = async () => {
    try {
        const res = await getDashboardData();
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
            message: res.message || 'Failed to fetch dashboard data',
        };
    } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        return {
            success: false,
            data: null,
            message: error.message || 'An error occurred while fetching dashboard data',
        };
    }
}