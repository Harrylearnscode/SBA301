import { handleApiError } from '../../utils/api.helper';
import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';

const QuoteService = {
    // Tạo yêu cầu báo giá mới
    createQuote: async (request: any) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.QUOTE.CREATE, request);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Lấy danh sách báo giá của user hiện tại
    getMyQuotes: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.QUOTE.GET_MY_QUOTES);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Lấy chi tiết báo giá theo ID
    getQuoteById: async (id: string | number) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.QUOTE.GET_BY_ID(id));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Trả lời báo giá (chấp nhận hoặc từ chối)
    replyToQuote: async (id: string | number, isAccepted: boolean) => {
        try {
            const response = await axiosInstance.post(
                `${API_ENDPOINTS.QUOTE.REPLY(id)}?isAccepted=${isAccepted}`
            );
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Hủy yêu cầu báo giá
    cancelQuote: async (id: string | number) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.QUOTE.CANCEL(id));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Lấy tất cả yêu cầu báo giá (dành cho admin/sales)
    getAllQuotes: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.QUOTE.GET_ALL_ADMIN);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Tiếp nhận yêu cầu báo giá (assign cho user hiện tại)
    assignToMe: async (id: string | number) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.QUOTE.ASSIGN_TO_ME(id));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Cung cấp báo giá cho khách hàng
    providePricing: async (id: string | number, request: any) => {
        try {
            const response = await axiosInstance.post(
                API_ENDPOINTS.QUOTE.PROVIDE_PRICING(id),
                request
            );
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

export default QuoteService;
