import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { HomeData } from '../types';

export function useDashboard() {
    const [data, setData] = useState<HomeData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const responseData = await dashboardService.getHomeData();
                setData(responseData);
            } catch (err: any) {
                setError(err.message || 'Erro ao carregar dados do dashboard');
            } finally {
                setIsLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    return {
        data,
        isLoading,
        error
    };
}
