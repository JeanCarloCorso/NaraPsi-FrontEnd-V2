import { useState, useRef, useEffect } from 'react';
import { Menu, User, UserCircle, LogOut, Sun, Moon } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

interface TopbarProps {
    toggleSidebar: () => void;
}

export default function Topbar({ toggleSidebar }: TopbarProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    });
    const dropdownRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Apply theme on mount and when it changes
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const nome = localStorage.getItem('nome') || 'Usuário';
    let perfilName = 'Profissional';
    try {
        const perfis = JSON.parse(localStorage.getItem('perfis') || '[]');
        if (perfis.length > 0) {
            perfilName = perfis[0].Perfil;
        }
    } catch (e) {
        // ignore
    }

    // Get current page name based on route
    const getPageName = () => {
        if (location.pathname === '/dashboard') return 'Início';
        if (location.pathname.startsWith('/pacientes')) return 'Pacientes';
        if (location.pathname.startsWith('/perfil')) return 'Meu Perfil';
        return 'Dashboard';
    };

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between sticky top-0 z-10 transition-all">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100 hidden sm:block">
                    {getPageName()}
                </h1>
            </div>

            <div className="flex items-center gap-3">
                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 p-1.5 pr-3 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                            <User className="w-4 h-4" />
                        </div>
                        <div className="hidden md:flex flex-col items-start text-left">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-tight block max-w-[120px] truncate">{nome}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight block">{perfilName}</span>
                        </div>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1 origin-top-right transform transition-all animate-in fade-in slide-in-from-top-2">
                            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 md:hidden">
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{nome}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{perfilName}</p>
                            </div>
                            <Link
                                to="/perfil"
                                onClick={() => setIsDropdownOpen(false)}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                            >
                                <UserCircle className="w-4 h-4 text-slate-400" />
                                Editar Perfil
                            </Link>
                            <button
                                onClick={toggleTheme}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between gap-2"
                            >
                                <div className="flex items-center gap-2">
                                    {theme === 'light' ? <Moon className="w-4 h-4 text-slate-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                                    Modo {theme === 'light' ? 'Escuro' : 'Claro'}
                                </div>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4 text-red-500" />
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
