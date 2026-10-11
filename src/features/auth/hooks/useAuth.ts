import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { sanitizeText } from '@shared/utils/validators';
import { useAuthSession } from '@shared/auth/authContext';
import { getDefaultRoute, getProfileNames } from '@shared/auth/session';

export function useAuth() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
    const navigate = useNavigate();
    const { setUser } = useAuthSession();

    const login = useCallback(async (usernameInput: string, passwordInput: string) => {
        setIsLoading(true);
        setError('');

        const sanitizedUsername = sanitizeText(usernameInput);
        const password = passwordInput;

        if (!sanitizedUsername) {
            setFieldErrors(prev => ({ ...prev, username: 'Informe o usuário' }));
            setIsLoading(false);
            return false;
        }

        if (!password) {
            setFieldErrors(prev => ({ ...prev, password: 'Informe a senha' }));
            setIsLoading(false);
            return false;
        }

        try {
            const data = await authService.login({
                username: sanitizedUsername,
                password
            });

            setUser(data);
            navigate(getDefaultRoute(getProfileNames(data.perfis)));
            return true;
        } catch (err: any) {
            setError(
                err.response?.data?.detail || 'Erro ao realizar login. Verifique suas credenciais.'
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [navigate, setUser]);

    return {
        login,
        isLoading,
        error,
        fieldErrors,
        setFieldErrors
    };
}
