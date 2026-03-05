import { useState, useCallback, useEffect } from 'react';
import { adminService } from '../services/adminService';
import type { HomeAdmResponse } from '../types';

export function useAdminHome() {
    const [data, setData] = useState<HomeAdmResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await adminService.getHomeAdm();
            setData(response);
        } catch (err: any) {
            console.error('Erro ao buscar dados do dashboard admin:', err);
            setError(err.response?.data?.detail || 'Erro ao carregar dados do dashboard.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
}
