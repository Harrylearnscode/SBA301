import { handleApiError } from '../../utils/api.helper';
import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';

const PolicyService = {
    // --- CÁC API DÀNH CHO QUẢN LÝ (ADMIN) ---

    /**
     * Tạo chính sách giảm giá mới
     * @param request - Dữ liệu PolicyRequest (mốc số lượng, % giảm giá, ...)
     */
    createPolicy: async (request: any) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.POLICY.CREATE, request);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Cập nhật chính sách giảm giá theo ID
     */
    updatePolicy: async (id: string | number, request: any) => {
        try {
            const response = await axiosInstance.put(API_ENDPOINTS.POLICY.UPDATE(id), request);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Xóa chính sách giảm giá
     */
    deletePolicy: async (id: string | number) => {
        try {
            const response = await axiosInstance.delete(API_ENDPOINTS.POLICY.DELETE(id));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // --- CÁC API DÙNG CHUNG / HIỂN THỊ ---

    /**
     * Lấy danh sách tất cả các chính sách đang có
     */
    getAllPolicies: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.POLICY.GET_ALL);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Lấy chi tiết một chính sách theo ID
     */
    getPolicyById: async (id: string | number) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.POLICY.GET_BY_ID(id));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Kiểm tra mức giảm giá áp dụng cho một số lượng hàng cụ thể
     * @param quantity - Số lượng sản phẩm khách muốn mua
     * @returns Mức giảm giá (%) - Ví dụ: 10, 20, 30
     */
    checkDiscount: async (quantity: number) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.POLICY.CHECK_DISCOUNT(quantity));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

export default PolicyService;