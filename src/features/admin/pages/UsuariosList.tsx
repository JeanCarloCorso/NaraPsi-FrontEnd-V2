import { useState } from 'react';
import { useAdminUsuarios } from '../hooks/useAdminUsuarios';
import ModalEditarUsuario from '../components/ModalEditarUsuario';
import { Users, Loader2, AlertCircle, Search, Edit2, ShieldCheck, Activity, CheckCircle, Plus } from 'lucide-react';
import type { UsuarioAdmin } from '../types';

export default function UsuariosList() {
    const {
        usuarios,
        perfis,
        isLoading,
        error,
        isSaving,
        notification,
        setNotification,
        atualizarUsuario
    } = useAdminUsuarios();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<UsuarioAdmin | null>(null);

    const filteredUsuarios = usuarios.filter(user =>
        user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.sexo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string | null) => {
        if (!dateString) return <span className="text-slate-400 dark:text-slate-500 italic">Nunca acessou</span>;
        const dateObj = new Date(dateString);
        if (isNaN(dateObj.getTime())) return dateString;
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(dateObj);
    };

    const formatOnlyDate = (dateString: string | null) => {
        if (!dateString) return '-';
        const dateObj = new Date(dateString);
        if (isNaN(dateObj.getTime())) return dateString;
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        }).format(dateObj);
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-500/20 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nome ou sexo..."
                        className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl leading-5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors shadow-sm"
                    />
                </div>
            </div>

            {/* Users List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                {filteredUsuarios.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Nome
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Sexo
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Perfis
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">
                                        Acessos
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-transparent divide-y divide-slate-100 dark:divide-slate-800/60">
                                {filteredUsuarios.map((usuario) => (
                                    <tr key={usuario.id_usuario} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900 dark:text-slate-200">
                                                {usuario.nome}
                                            </div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block mt-1">
                                                Criado em {formatOnlyDate(usuario.data_criacao)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                ${usuario.sexo.toLowerCase() === 'feminino'
                                                    ? 'bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-500/20'
                                                    : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'}
                                            `}>
                                                {usuario.sexo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                                                ${usuario.login_ativo
                                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                                                    : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'}
                                            `}>
                                                {usuario.login_ativo ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-normal">
                                            <div className="flex flex-wrap gap-1">
                                                {usuario.perfis.map((perfil, index) => (
                                                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                        <ShieldCheck className="w-3 h-3 mr-1" />
                                                        {perfil}
                                                    </span>
                                                ))}
                                                {usuario.perfis.length === 0 && (
                                                    <span className="text-xs text-slate-400 italic">Sem perfis</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 hidden md:table-cell">
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-1 text-xs">
                                                    <Activity className="w-3 h-3 text-slate-400" />
                                                    {formatDate(usuario.ultimo_acesso)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => setSelectedUser(usuario)}
                                                className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors px-3 py-1.5 rounded-lg flex items-center gap-1.5 ml-auto"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 dark:text-slate-400">
                        <Users className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-700" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
                            Nenhum usuário encontrado
                        </h3>
                        <p className="text-sm">Tente buscar por um nome diferente.</p>
                    </div>
                )}
            </div>

            {/* Modal de Edição */}
            <ModalEditarUsuario
                usuario={selectedUser}
                perfisDisponiveis={perfis}
                isOpen={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                onSave={atualizarUsuario}
                isSaving={isSaving}
            />

            {/* Sistema de Notificação (Toast) */}
            {notification.visible && (
                <div className={`fixed top-6 right-6 z-[100] min-w-[300px] p-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-full duration-300 flex items-center gap-3
                    ${notification.type === 'success'
                        ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-500/20'
                        : 'bg-white dark:bg-slate-900 border-red-200 dark:border-red-500/20'
                    }`}
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                        ${notification.type === 'success'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                        }`}
                    >
                        {notification.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {notification.type === 'success' ? 'Sucesso!' : 'Ocorreu um erro'}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {notification.message}
                        </p>
                    </div>
                    <button
                        onClick={() => setNotification(prev => ({ ...prev, visible: false }))}
                        className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4 rotate-45" />
                    </button>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 h-1 bg-slate-100 dark:bg-slate-800 w-full overflow-hidden rounded-b-2xl">
                        <div className={`h-full animate-toast-progress
                            ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
