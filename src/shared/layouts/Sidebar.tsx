import { NavLink } from 'react-router-dom';
import {
    Home,
    Users,
    X,
    Stethoscope
} from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    isMobile: boolean;
}

export default function Sidebar({ isOpen, setIsOpen, isMobile }: SidebarProps) {
    const navItems = [
        { name: 'Início', path: '/dashboard', icon: Home },
        { name: 'Pacientes', path: '/pacientes', icon: Users },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-30 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64 translate-x-0' : isMobile ? '-translate-x-full w-64' : 'w-20 translate-x-0'}
        `}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-primary-100 dark:border-slate-700">
                            <Stethoscope className="w-6 h-6 text-primary-600 dark:text-primary-500" />
                        </div>
                        {isOpen && (
                            <span className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">NaraPsi</span>
                        )}
                    </div>
                    {isMobile && (
                        <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-3 space-y-1 bg-white dark:bg-slate-900 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                                  flex items-center gap-3 px-3 py-3 rounded-xl transition-all group
                                  ${isActive
                                        ? 'bg-primary-50 dark:bg-slate-800 text-primary-700 dark:text-primary-400 font-medium'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                                    }
                                  ${!isOpen && !isMobile ? 'justify-center' : ''}
                                `}
                                title={!isOpen && !isMobile ? item.name : ''}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${!isOpen && !isMobile ? 'text-slate-400 group-hover:text-primary-500' : ''}`} />
                                {(isOpen || isMobile) && (
                                    <span className="truncate">{item.name}</span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
