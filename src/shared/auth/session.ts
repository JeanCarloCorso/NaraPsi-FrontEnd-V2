export const SESSION_KEYS = ['access_token', 'nome', 'perfis'] as const;

type ProfileValue = string | { Perfil?: unknown };

export function getAccessToken(): string | null {
    return localStorage.getItem('access_token');
}

export function getProfiles(): string[] {
    try {
        const stored: unknown = JSON.parse(localStorage.getItem('perfis') || '[]');
        if (!Array.isArray(stored)) return [];

        return stored.flatMap((profile: ProfileValue) => {
            if (typeof profile === 'string') return [profile];
            return typeof profile?.Perfil === 'string' ? [profile.Perfil] : [];
        });
    } catch {
        return [];
    }
}

export function clearSession(): void {
    SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
}

export function getDefaultRoute(profiles = getProfiles()): string {
    if (profiles.includes('Administrador')) return '/admin/dashboard';
    if (profiles.includes('Psicologo')) return '/dashboard';
    if (profiles.includes('Usuario') || profiles.includes('Paciente')) return '/paciente/home';
    return '/';
}

