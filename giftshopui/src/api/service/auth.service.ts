import { handleApiError } from '../../utils/api.helper';
import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';

const AuthService = {
    login: async (credentials: any) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
            return response.data; 
        } catch (error) {
            throw handleApiError(error);
        }
    },

    register: async (userData: any) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    logout: async () => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }
};

export default AuthService;