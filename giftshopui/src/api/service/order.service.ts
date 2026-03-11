import { handleApiError } from '../../utils/api.helper';
import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';

const OrderService = {
    // --- API CHO KHÁCH HÀNG ---

    /**
     * Đặt hàng (Checkout)
     * @param request - Dữ liệu giỏ hàng và thông tin vận chuyển
     */
    checkout: async (request: any) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.ORDER.CHECKOUT, request);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Lấy danh sách đơn hàng của người dùng hiện tại
     */
    getMyOrders: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.ORDER.MY_ORDERS);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Lấy chi tiết đơn hàng theo ID
     */
    getOrderById: async (id: string | number) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.ORDER.GET_BY_ID(id));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Hủy đơn hàng
     */
    cancelOrder: async (id: string | number) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.ORDER.CANCEL(id));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // --- API CHO ADMIN ---

    /**
     * Lấy tất cả đơn hàng (Dành cho Admin)
     */
    getAllOrders: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.ORDER.GET_ALL_ADMIN);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Cập nhật trạng thái đơn hàng (Đang xử lý, Đang giao, v.v.)
     */
    updateOrderStatus: async (id: string | number, request: { status: string }) => {
        try {
            const response = await axiosInstance.put(API_ENDPOINTS.ORDER.UPDATE_STATUS(id), request);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Cập nhật trạng thái thanh toán
     */
    updatePaymentStatus: async (id: string | number, request: { paymentStatus: string }) => {
        try {
            const response = await axiosInstance.put(API_ENDPOINTS.ORDER.UPDATE_PAYMENT(id), request);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

export default OrderService;