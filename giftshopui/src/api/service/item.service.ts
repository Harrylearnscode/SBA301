import { handleApiError } from '../../utils/api.helper';
import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';

const ItemService = {
    /**
     * Nhập kho lô hàng mới (Batch)
     * @param request - Dữ liệu lô hàng (ItemRequest)
     */
    createItemBatch: async (request: any) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.ITEM.CREATE_BATCH, request);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Cập nhật thông tin lô hàng theo ID
     * @param id - ID của lô hàng/item
     * @param request - Dữ liệu cập nhật
     */
    updateItemBatch: async (id: string | number, request: any) => {
        try {
            const response = await axiosInstance.put(API_ENDPOINTS.ITEM.UPDATE_BATCH(id), request);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Lấy danh sách tất cả các item/lô hàng thuộc về một sản phẩm cụ thể
     * @param productId - ID của sản phẩm
     */
    getItemsByProduct: async (productId: string | number) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.ITEM.GET_BY_PRODUCT(productId));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Lấy tổng số lượng tồn kho khả dụng của một sản phẩm
     * @param productId - ID của sản phẩm
     */
    getAvailableQuantity: async (productId: string | number) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.ITEM.GET_AVAILABLE(productId));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    getAllItems: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.ITEM.GET_ALL);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

export default ItemService;