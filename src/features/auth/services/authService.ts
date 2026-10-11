import api from '@shared/api/apiClient';
import type { AuthUser, LoginResponse, LoginCredentials } from '../types';

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

    async getSession(): Promise<AuthUser> {
        const response = await api.get<AuthUser>('/session');
        return response.data;
    },

    async logout() {
        await api.post('/logout');
    }
};
