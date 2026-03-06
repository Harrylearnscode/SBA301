import { handleApiError } from '../../utils/api.helper';
import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';

const CartService = {
    getMyCart: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.CART.GET_MY_CART);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    addToCart: async (productId: number, quantity: number) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.CART.ADD_ITEM, {
                productId,
                quantity
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    updateQuantity: async (cartItemId: number, quantity: number) => {
        try {
            const response = await axiosInstance.put(API_ENDPOINTS.CART.UPDATE_ITEM, {
                cartItemId,
                quantity
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    removeItem: async (cartItemId: number) => {
        try {
            const response = await axiosInstance.delete(API_ENDPOINTS.CART.REMOVE_ITEM(cartItemId));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }
};

export default CartService;