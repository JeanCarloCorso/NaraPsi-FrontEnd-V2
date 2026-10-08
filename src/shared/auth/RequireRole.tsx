import { Navigate, Outlet } from 'react-router-dom';
import { getDefaultRoute, getProfiles } from './session';

interface RequireRoleProps {
    allowed: string[];
}

export default function RequireRole({ allowed }: RequireRoleProps) {
    const profiles = getProfiles();
    const isAllowed = allowed.some((role) => profiles.includes(role));

    return isAllowed ? <Outlet /> : <Navigate to={getDefaultRoute(profiles)} replace />;
}

