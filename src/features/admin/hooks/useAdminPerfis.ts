import { useState, useCallback, useEffect } from 'react';
import { adminService } from '../services/adminService';
import type { PerfilResponse, CriarPerfilRequest } from '../types';

export function useAdminPerfis() {
    const [perfis, setPerfis] = useState<PerfilResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Notification state
    const [notification, setNotification] = useState<{ visible: boolean; type: 'success' | 'error'; message: string }>({
        visible: false,
        type: 'success',
        message: ''
    });

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ visible: true, type, message });
        setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 3000);
    };

    const fetchPerfis = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await adminService.getPerfis();
            setPerfis(data);
        } catch (err: any) {
            console.error('Erro ao buscar perfis:', err);
            setError(err.response?.data?.detail || 'Erro ao carregar lista de perfis.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPerfis();
    }, [fetchPerfis]);

    const criarPerfil = async (payload: CriarPerfilRequest) => {
        setIsSaving(true);
        try {
            const res = await adminService.criarPerfil(payload);
            showNotification('success', res.mensagem || 'Perfil criado com sucesso!');
            await fetchPerfis(); // Refresh list after creation
            return true;
        } catch (err: any) {
            console.error('Erro ao criar perfil:', err);
            showNotification('error', err.response?.data?.detail || 'Erro ao criar perfil.');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return {
        perfis,
        isLoading,
        error,
        isSaving,
        notification,
        setNotification,
        criarPerfil,
        refetch: fetchPerfis
    };
}
