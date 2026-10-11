import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuthSession } from '@shared/auth/authContext';

export default function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const { user, isLoading } = useAuthSession();

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                isMobile={isMobile}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Topbar */}
                <Topbar
                    toggleSidebar={toggleSidebar}
                />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
