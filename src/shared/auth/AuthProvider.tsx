import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authService } from '@features/auth/services/authService';
import type { AuthUser } from '@features/auth/types';
import { AuthContext } from './authContext';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshSession = useCallback(async () => {
        try {
            setUser(await authService.getSession());
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void refreshSession();
    }, [refreshSession]);

    const updateName = useCallback((name: string) => {
        setUser(current => current ? { ...current, nome: name } : current);
    }, []);

    const value = useMemo(
        () => ({ user, isLoading, setUser, refreshSession, updateName }),
        [user, isLoading, refreshSession, updateName],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
