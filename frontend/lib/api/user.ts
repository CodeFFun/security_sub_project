import { axiosInstance } from './axios';
import { getAuthToken,setUserData } from '../cookie';
export const updateUser = async(userData: FormData) => {
    try{
        const token = await getAuthToken();
        const response = await axiosInstance.patch(`/auth/update`, userData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        await setUserData(response.data.data);
        return response.data;
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message  
            || err.message 
            || "User update failed" 
        )
    }
}


