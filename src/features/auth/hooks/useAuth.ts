import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { sanitizeText } from '@shared/utils/validators';

export function useAuth() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
    const navigate = useNavigate();

    const login = useCallback(async (usernameInput: string, passwordInput: string) => {
        setIsLoading(true);
        setError('');

        const sanitizedUsername = sanitizeText(usernameInput);
        const trimmedPassword = passwordInput.trim();

        if (!sanitizedUsername) {
            setFieldErrors(prev => ({ ...prev, username: 'Informe o usuário' }));
            setIsLoading(false);
            return false;
        }

        if (!trimmedPassword) {
            setFieldErrors(prev => ({ ...prev, password: 'Informe a senha' }));
            setIsLoading(false);
            return false;
        }

        try {
            const data = await authService.login({
                username: sanitizedUsername,
                password: trimmedPassword
            });

            authService.saveSession(data);

            if (data.perfis && data.perfis.length > 0) {
                const isAdmin = data.perfis.some(p =>
                    (typeof p === 'string' ? p : p.Perfil) === 'Administrador'
                );

                if (isAdmin) {
                    navigate('/admin/dashboard');
                } else if (data.perfis.some(p => (typeof p === 'string' ? p : p.Perfil) === 'Psicologo')) {
                    navigate('/dashboard');
                } else {
                    navigate('/paciente/home');
                }
            } else {
                navigate('/');
            }
            return true;
        } catch (err: any) {
            setError(
                err.response?.data?.detail || 'Erro ao realizar login. Verifique suas credenciais.'
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    return {
        login,
        isLoading,
        error,
        fieldErrors,
        setFieldErrors
    };
}
