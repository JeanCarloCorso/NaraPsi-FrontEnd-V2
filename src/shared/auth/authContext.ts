import { createContext, useContext } from 'react';
import type { AuthUser } from '@features/auth/types';

export interface AuthContextValue {
    user: AuthUser | null;
    isLoading: boolean;
    setUser: (user: AuthUser | null) => void;
    refreshSession: () => Promise<void>;
    updateName: (name: string) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuthSession(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuthSession deve ser usado dentro de AuthProvider');
    return context;
}
