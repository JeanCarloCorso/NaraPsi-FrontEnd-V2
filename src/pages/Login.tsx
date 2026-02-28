import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Loader2, User, Lock, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { sanitizeText } from '../utils/validators';

interface LoginResponse {
    access_token: string;
    token_type: string;
    nome: string;
    perfis: {
        Perfil: string;
        descricao: string;
    }[];
}

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const sanitizedUsername = sanitizeText(username);
        const trimmedPassword = password.trim();

        if (!sanitizedUsername) {
            setFieldErrors(prev => ({ ...prev, username: 'Informe o usuário' }));
            setIsLoading(false);
            return;
        }

        if (!trimmedPassword) {
            setFieldErrors(prev => ({ ...prev, password: 'Informe a senha' }));
            setIsLoading(false);
            return;
        }

        try {
            // POST request to /login
            const formData = new URLSearchParams();
            formData.append('username', sanitizedUsername);
            formData.append('password', trimmedPassword);

            const response = await api.post<LoginResponse>('/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const data = response.data;

            // Save data
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('nome', data.nome);
            localStorage.setItem('perfis', JSON.stringify(data.perfis));

            // Redirect to route based on first profile (for now just /dashboard)
            if (data.perfis && data.perfis.length > 0) {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        } catch (err: any) {
            setError(
                err.response?.data?.detail || 'Erro ao realizar login. Verifique suas credenciais.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary-50 dark:bg-slate-900 flex items-center justify-center p-4 selection:bg-primary-200 dark:selection:bg-primary-900">
            <div className="w-full max-w-md">
                {/* Brand Container */}
                <div className="flex flex-col items-center mb-8">
                    <div className="h-16 w-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center mb-4 border border-primary-100 dark:border-slate-700">
                        <Stethoscope className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
                        NaraPsi
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm text-center px-4">
                        Núcleo de Acompanhamento e Suporte Psicológico Automatizado
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl shadow-primary-900/5 dark:shadow-black/20 p-8 border border-white/60 dark:border-slate-700 backdrop-blur-xl">
                    <form onSubmit={handleLogin} className="space-y-6">

                        {error && (
                            <div className="bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 p-3 rounded-xl text-sm border border-red-100 dark:border-red-500/20 flex items-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Username Field */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                                    Usuário
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            if (fieldErrors.username) setFieldErrors(prev => ({ ...prev, username: undefined }));
                                        }}
                                        required
                                        className={`block w-full pl-11 pr-4 py-3 bg-slate-50/50 dark:bg-slate-900/50 border ${fieldErrors.username ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-2xl text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all`}
                                        placeholder="nome.sobrenome"
                                    />
                                    {fieldErrors.username && (
                                        <p className="text-red-500 text-xs mt-1 ml-1 animate-in fade-in slide-in-from-top-1">{fieldErrors.username}</p>
                                    )}
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                                    Senha
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }));
                                        }}
                                        required
                                        className={`block w-full pl-11 pr-4 py-3 bg-slate-50/50 dark:bg-slate-900/50 border ${fieldErrors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-2xl text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all`}
                                        placeholder="******"
                                    />
                                    {fieldErrors.password && (
                                        <p className="text-red-500 text-xs mt-1 ml-1 animate-in fade-in slide-in-from-top-1">{fieldErrors.password}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full relative flex items-center justify-center py-3.5 px-4 rounded-2xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 shadow-lg shadow-primary-600/20"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span className="mr-2">ENTRAR</span>
                                    <ArrowRight className="w-4 h-4 opacity-80" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-slate-400 mt-8">
                    &copy; 2026 NaraPsi. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
}
