type ProfileValue = string | { Perfil?: unknown };

export function getProfileNames(profiles: ProfileValue[] = []): string[] {
    return profiles.flatMap(profile => {
        if (typeof profile === 'string') return [profile];
        return typeof profile?.Perfil === 'string' ? [profile.Perfil] : [];
    });
}

export function getDefaultRoute(profiles: string[]): string {
    if (profiles.includes('Administrador')) return '/admin/dashboard';
    if (profiles.includes('Psicologo')) return '/dashboard';
    if (profiles.includes('Usuario') || profiles.includes('Paciente')) return '/paciente/home';
    return '/';
}
