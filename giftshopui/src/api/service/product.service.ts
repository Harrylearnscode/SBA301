import { handleApiError } from '../../utils/api.helper';
import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';

const ProductService = {
    // 1. Lấy danh sách tất cả sản phẩm
    getAllProducts: async (onlyActive: boolean = true) => {
        try {
            const response = await axiosInstance.get(`${API_ENDPOINTS.PRODUCT.GET_ALL}?onlyActive=${onlyActive}`);
            return response.data; 
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // 2. Lấy chi tiết 1 sản phẩm theo ID
    getProductById: async (id: string | number) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.PRODUCT.GET_BY_ID(id));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // 3. Tạo mới sản phẩm (@PostMapping)
    createProduct: async (formData: FormData) => {
        try {
            // Thêm cấu hình headers để ép Axios gửi đúng định dạng form-data
            const response = await axiosInstance.post(API_ENDPOINTS.PRODUCT.CREATE, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    updateProduct: async (id: number, formData: FormData) => {
        try {
            // Thêm cấu hình headers tương tự cho hàm Update
            const response = await axiosInstance.put(API_ENDPOINTS.PRODUCT.UPDATE(id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // 5. Thay đổi trạng thái ẩn/hiện (@PatchMapping("/{id}/toggle-active"))
    toggleActiveStatus: async (id: string | number) => {
        try {
            // Lưu ý: Endpoint này thường có dạng /api/products/{id}/toggle-active
            const response = await axiosInstance.patch(`${API_ENDPOINTS.PRODUCT.GET_BY_ID(id)}/toggle-active`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // 6. Lấy sản phẩm tương tự (Logic phía Frontend)
    getSimilarProducts: async (currentProductId: string | number, limit: number = 4) => {
        try {
            const response = await axiosInstance.get(`${API_ENDPOINTS.PRODUCT.GET_ALL}?onlyActive=true`);
            const data = response.data;
            
            if (data.isSuccess && Array.isArray(data.data)) {
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