import { handleApiError } from '../../utils/api.helper';
import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';

const ProductService = {
    // Lấy danh sách tất cả sản phẩm (Có thể truyền tham số onlyActive)
    getAllProducts: async (onlyActive: boolean = true) => {
        try {
            const response = await axiosInstance.get(`${API_ENDPOINTS.PRODUCT.GET_ALL}?onlyActive=${onlyActive}`);
            return response.data; 
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Lấy chi tiết 1 sản phẩm theo ID
    getProductById: async (id: string | number) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.PRODUCT.GET_BY_ID(id));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    getSimilarProducts: async (currentProductId: string | number, limit: number = 4) => {
        try {
            const response = await axiosInstance.get(`${API_ENDPOINTS.PRODUCT.GET_ALL}?onlyActive=true`);
            const data = response.data;
            
            if (data.success && Array.isArray(data.data)) {
                // Lọc bỏ sản phẩm hiện tại đang xem và chỉ lấy đúng số lượng 'limit'
                data.data = data.data
                    .filter((p: any) => String(p.id) !== String(currentProductId))
                    .slice(0, limit);
            }
            return data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

export default ProductService;