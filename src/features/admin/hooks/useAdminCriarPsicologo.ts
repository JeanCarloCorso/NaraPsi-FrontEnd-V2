import { useState } from 'react';
import { adminService } from '../services/adminService';
import type { PsicologoCreatePayload } from '../types';

export function useAdminCriarPsicologo() {
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

    const criarPsicologo = async (payload: PsicologoCreatePayload) => {
        setIsSaving(true);
        try {
            const res = await adminService.criarPsicologo(payload);
            showNotification('success', res.mensagem || 'Psicólogo registrado com sucesso!');
            return true;
        } catch (err: any) {
            console.error('Erro ao criar psicólogo:', err);

            // Handle Validation Errors format directly
            let errorMessage = 'Erro ao criar psicólogo. Verifique os dados e tente novamente.';

            if (err.response?.status === 403) {
                errorMessage = 'Acesso permitido apenas para administradores.';
            } else if (err.response?.status === 401) {
                errorMessage = 'Sessão expirada ou não autorizada.';
            } else if (err.response?.data?.detail) {
                if (Array.isArray(err.response.data.detail)) {
                    // Usually Pydantic validation errors come as array
                    errorMessage = 'Erro de validação: ' + err.response.data.detail.map((e: any) => e.msg).join(', ');
                } else if (typeof err.response.data.detail === 'string') {
                    errorMessage = err.response.data.detail;
                }
            }

            showNotification('error', errorMessage);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return {
        isSaving,
        notification,
        setNotification,
        criarPsicologo
    };
}
