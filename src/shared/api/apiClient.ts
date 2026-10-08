import axios from 'axios';
import { clearSession, getAccessToken } from '@shared/auth/session';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Setup interceptor for Authorization header in the future
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginRequest = error.config?.url?.endsWith('/login');
        if (error.response?.status === 401 && !isLoginRequest) {
            clearSession();
            if (window.location.pathname !== '/') {
                window.location.assign('/');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
