import api from '@shared/api/apiClient';
import type { LoginResponse, LoginCredentials } from '../types';

export const authService = {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const formData = new URLSearchParams();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        const response = await api.post<LoginResponse>('/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return response.data;
    },

    saveSession(data: LoginResponse) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('nome', data.nome);
        localStorage.setItem('perfis', JSON.stringify(data.perfis));
    },

    clearSession() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('nome');
        localStorage.removeItem('perfis');
    }
};
