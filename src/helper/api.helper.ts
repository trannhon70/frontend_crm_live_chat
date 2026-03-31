import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
const apiUrl = import.meta.env.VITE_API_URL_API;
const instance = axios.create({

    baseURL: apiUrl,
    headers: { 'Content-Type': 'application/json' },
});

// Interceptor cho request
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => { 
        const token = localStorage.getItem('token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);

// Interceptor cho response
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        // console.log(response, 'response');
        return response;
    },
    async (error) => {
        console.log(error.response.data.message, 'error');
        // Kiểm tra nếu lỗi là 401 (Unauthorized) và token hết hạn
        if (error.response.data && error.response.data.message === 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' || error.response.data.message === "Tài khoản đã được đăng nhập nơi khác!" || error.response.data.message === "Phiên đăng nhập đã hết hạn hoặc không tồn tại.") {
            localStorage.clear();
            window.location.reload();
            return Promise.reject(error); 
        }

        return Promise.reject(error); 
    }
);

export default instance;