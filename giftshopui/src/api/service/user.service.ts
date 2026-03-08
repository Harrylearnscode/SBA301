import { handleApiError } from '../../utils/api.helper';
import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';

const UserService = {
    getMyProfile: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.USER.GET_ME);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    
    updateMyProfile: async (data: any) => {
        try {
            const response = await axiosInstance.put(API_ENDPOINTS.USER.UPDATE_ME, data);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }
};

export default UserService;