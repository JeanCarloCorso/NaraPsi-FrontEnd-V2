import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginRequest = error.config?.url?.endsWith('/login');
        const isSessionRequest = error.config?.url?.endsWith('/session');
        if (error.response?.status === 401 && !isLoginRequest && !isSessionRequest) {
            if (window.location.pathname !== '/') {
                window.location.assign('/');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
