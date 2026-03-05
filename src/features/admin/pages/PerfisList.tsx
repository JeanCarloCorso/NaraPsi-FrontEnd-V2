import { useNavigate } from 'react-router-dom';
import { useAdminPerfis } from '../hooks/useAdminPerfis';
import { ShieldCheck, Plus, Loader2, AlertCircle, Search } from 'lucide-react';
import { useState } from 'react';

export default function PerfisList() {
    const navigate = useNavigate();
    const { perfis, isLoading, error } = useAdminPerfis();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPerfis = perfis.filter(perfil =>
        perfil.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perfil.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        placeholder="Buscar por nome ou descrição..."
                        className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl leading-5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors shadow-sm"
                    />
                </div>

                <button
                    onClick={() => navigate('/admin/perfis/novo')}
                    className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm shadow-primary-500/30 flex items-center justify-center gap-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Novo Perfil
                </button>
            </div>

            {/* Perfis List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                {filteredPerfis.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-20">
                                        ID
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Nome
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Descrição
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-transparent divide-y divide-slate-100 dark:divide-slate-800/60">
                                {filteredPerfis.map((perfil) => (
                                    <tr key={perfil.id_perfil} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                            #{perfil.id_perfil}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
                                                    <ShieldCheck className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                                </div>
                                                <div className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                                                    {perfil.nome}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                            {perfil.descricao}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 dark:text-slate-400">
                        <ShieldCheck className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-700" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
                            Nenhum perfil encontrado
                        </h3>
                    </div>
                )}
            </div>
        </div>
    );
}
