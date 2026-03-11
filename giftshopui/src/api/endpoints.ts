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
    CREATE: '/products',
    UPDATE: (id: string | number) => `/products/${id}`,
    TOGGLE_ACTIVE: (id: string | number) => `/products/${id}/toggle-active`,
},

    CART: {
    GET_MY_CART: '/carts',
    ADD_ITEM: '/carts/items',
    UPDATE_ITEM: (itemId: string | number) => `/carts/items/${itemId}`,
    REMOVE_ITEM: (itemId: string | number) => `/carts/items/${itemId}`,
    CLEAR: '/carts/clear'
    },

    QUOTE: {
    CREATE: '/quotes',
    GET_MY_QUOTES: '/quotes/me',
    GET_BY_ID: (id: string | number) => `/quotes/${id}`,
    REPLY: (id: string | number) => `/quotes/${id}/reply`,
    CANCEL: (id: string | number) => `/quotes/${id}/cancel`,
    GET_ALL_ADMIN: '/quotes/admin',
    ASSIGN_TO_ME: (id: string | number) => `/quotes/admin/${id}/assign`,
    PROVIDE_PRICING: (id: string | number) => `/quotes/admin/${id}/provide-pricing`,
    },

    CATEGORY: {
        GET_ALL: '/categories',
        GET_ROOTS: '/categories/roots',
        GET_BY_ID: (id: string | number) => `/categories/${id}`,
        CREATE: '/categories',
        UPDATE: (id: string | number) => `/categories/${id}`,
        DELETE: (id: string | number) => `/categories/${id}`,
    },

    ITEM: {
        GET_ALL: '/items',
        CREATE_BATCH: '/items',
        UPDATE_BATCH: (id: string | number) => `/items/${id}`,
        GET_BY_PRODUCT: (productId: string | number) => `/items/product/${productId}`,
        GET_AVAILABLE: (productId: string | number) => `/items/product/${productId}/available`,
    },

    ORDER: {
        CHECKOUT: '/orders/checkout',
        MY_ORDERS: '/orders/my-orders',
        GET_BY_ID: (id: string | number) => `/orders/${id}`,
        CANCEL: (id: string | number) => `/orders/${id}/cancel`,
        // Admin
        GET_ALL_ADMIN: '/orders/admin',
        UPDATE_STATUS: (id: string | number) => `/orders/admin/${id}/status`,
        UPDATE_PAYMENT: (id: string | number) => `/orders/admin/${id}/payment`,
    },

    USER: {
        GET_ALL: '/users',
        GET_BY_ID: (id: string | number) => `/users/${id}`,
        CREATE: '/users',
        UPDATE: (id: string | number) => `/users/${id}`,
        DELETE: (id: string | number) => `/users/${id}`,
    },

    POLICY: {
        CREATE: '/policies',
        UPDATE: (id: string | number) => `/policies/${id}`,
        DELETE: (id: string | number) => `/policies/${id}`,
        GET_ALL: '/policies',
        GET_BY_ID: (id: string | number) => `/policies/${id}`,
        CHECK_DISCOUNT: (quantity: number) => `/policies/check-discount?quantity=${quantity}`,
    },
}

export default API_ENDPOINTS;