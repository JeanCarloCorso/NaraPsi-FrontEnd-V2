import { Navigate, Outlet } from 'react-router-dom';
import { useAuthSession } from './authContext';
import { getDefaultRoute, getProfileNames } from './session';

interface RequireRoleProps {
    allowed: string[];
}

export default function RequireRole({ allowed }: RequireRoleProps) {
    const { user, isLoading } = useAuthSession();
    const profiles = getProfileNames(user?.perfis);
    const isAllowed = allowed.some((role) => profiles.includes(role));

    if (isLoading) return null;
    if (!user) return <Navigate to="/" replace />;
    return isAllowed ? <Outlet /> : <Navigate to={getDefaultRoute(profiles)} replace />;
}
