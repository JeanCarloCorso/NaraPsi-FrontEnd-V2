import api from '@shared/api/apiClient';
import type { HomeData } from '../types';

export const dashboardService = {
    async getHomeData(): Promise<HomeData> {
        const response = await api.get('/home');
        return response.data;
    }
};
