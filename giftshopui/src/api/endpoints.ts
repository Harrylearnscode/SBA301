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
    GET_MY_CART: '/carts',
    ADD_ITEM: '/carts/items',
    UPDATE_ITEM: (itemId: string | number) => `/carts/items/${itemId}`,
    REMOVE_ITEM: (itemId: string | number) => `/carts/items/${itemId}`,
    CLEAR: '/carts/clear'
  },

  USER: {
        GET_ME: '/users/me',
        UPDATE_ME: '/users/me',
  }
}

export default API_ENDPOINTS;