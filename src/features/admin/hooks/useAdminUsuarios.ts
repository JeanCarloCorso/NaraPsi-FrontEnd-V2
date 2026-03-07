import { useState, useCallback, useEffect } from 'react';
import { adminService } from '../services/adminService';
import type { UsuarioAdmin, UpdateUsuarioRequest, PerfilResponse } from '../types';

export function useAdminUsuarios() {
    const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
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

    const fetchUsuarios = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await adminService.getUsuarios();
            setUsuarios(data);
        } catch (err: any) {
            console.error('Erro ao buscar usuários:', err);
            setError(err.response?.data?.detail || 'Erro ao carregar lista de usuários.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchPerfis = useCallback(async () => {
        try {
            const data = await adminService.getPerfis();
            setPerfis(data);
        } catch (err) {
            console.error('Erro ao buscar perfis:', err);
        }
    }, []);

    useEffect(() => {
        fetchUsuarios();
        fetchPerfis();
    }, [fetchUsuarios, fetchPerfis]);

    const atualizarUsuario = async (id: number, payload: UpdateUsuarioRequest) => {
        setIsSaving(true);
        try {
            const res = await adminService.atualizarUsuario(id, payload);
            showNotification('success', res.mensagem || 'Usuário atualizado com sucesso!');
            await fetchUsuarios(); // Refresh list after update
            return true;
        } catch (err: any) {
            console.error('Erro ao atualizar usuário:', err);
            showNotification('error', err.response?.data?.detail || 'Erro ao atualizar usuário.');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return {
        usuarios,
        perfis,
        isLoading,
        error,
        isSaving,
        notification,
        setNotification,
        atualizarUsuario,
        refetch: fetchUsuarios
    };
}
