import { handleApiError } from '../../utils/api.helper';
import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';

const UserService = {
    /**
     * Lấy danh sách tất cả người dùng
     * Thường dùng cho trang quản trị Admin
     */
    getAllUsers: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.USER.GET_ALL);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Lấy thông tin chi tiết một người dùng theo ID
     * @param id - ID của người dùng
     */
    getUserById: async (id: string | number) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.USER.GET_BY_ID(id));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Tạo người dùng mới
     * @param request - Dữ liệu UserRequest (username, password, email, role, v.v.)
     */
    createUser: async (request: any) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.USER.CREATE, request);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Cập nhật thông tin người dùng
     * @param id - ID người dùng cần cập nhật
     * @param request - Dữ liệu cập nhật mới
     */
    updateUser: async (id: string | number, request: any) => {
        try {
            const response = await axiosInstance.put(API_ENDPOINTS.USER.UPDATE(id), request);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Xóa người dùng khỏi hệ thống
     * @param id - ID người dùng cần xóa
     */
    deleteUser: async (id: string | number) => {
        try {
            const response = await axiosInstance.delete(API_ENDPOINTS.USER.DELETE(id));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

export default UserService;