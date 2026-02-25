import axios, {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosResponse,
    AxiosError
} from 'axios';

// Định nghĩa interface cho cấu trúc lỗi từ Server (tùy chỉnh theo API của bạn)
interface ApiErrorResponse {
    message?: string;
    status?: number;
}

const baseURL: string = 'localhost:8080/api';

const axiosInstance: AxiosInstance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    (error: AxiosError<ApiErrorResponse>) => {
        // Xử lý khi token hết hạn hoặc không hợp lệ
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // Chú ý: Trong các framework như React/Next.js,
            // nên dùng router push thay vì window.location để tránh reload trang
            window.location.href = '/auth';
        }

        // Lấy message từ server trả về
        const customMessage = error.response?.data?.message;
        console.log('==> customMessage', customMessage);

        if (customMessage) {
            // Trong TS, chúng ta cần ép kiểu hoặc mở rộng interface nếu muốn thêm property lạ
            // Ở đây ta tận dụng thuộc tính message có sẵn của Error
            error.message = customMessage;

            // Nếu muốn dùng error.customMessage, bạn có thể cast sang 'any'
            // hoặc định nghĩa một CustomAxiosError.
            (error as any).customMessage = customMessage;
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;