const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH_TOKEN: '/auth/refresh-token',
        LOGOUT: '/auth/logout',
    },

    PRODUCT: {
    GET_ALL: '/products',
    GET_BY_ID: (id: string | number) => `/products/${id}`,
    },

    CART: {
    GET_MY_CART: '/api/carts',
    ADD_ITEM: '/api/carts/items',
    UPDATE_ITEM: (itemId: string | number) => `/api/carts/items/${itemId}`,
    REMOVE_ITEM: (itemId: string | number) => `/api/carts/items/${itemId}`,
    CLEAR: '/api/carts/clear'
  }
}

export default API_ENDPOINTS;