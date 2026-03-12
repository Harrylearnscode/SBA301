import { handleApiError } from '../../utils/api.helper';
import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';

const CategoryService = {
    // Lấy tất cả danh mục
    getAllCategories: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.CATEGORY.GET_ALL);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Lấy danh sách danh mục gốc (roots)
    getRootCategories: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.CATEGORY.GET_ROOTS);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Lấy chi tiết danh mục theo ID
    getCategoryById: async (id: string | number) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.CATEGORY.GET_BY_ID(id));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Tạo danh mục mới
    createCategory: async (request: any) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.CATEGORY.CREATE, request);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Cập nhật danh mục
    updateCategory: async (id: string | number, request: any) => {
        try {
            const response = await axiosInstance.put(API_ENDPOINTS.CATEGORY.UPDATE(id), request);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Xóa danh mục
    deleteCategory: async (id: string | number) => {
        try {
            const response = await axiosInstance.delete(API_ENDPOINTS.CATEGORY.DELETE(id));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

export default CategoryService;