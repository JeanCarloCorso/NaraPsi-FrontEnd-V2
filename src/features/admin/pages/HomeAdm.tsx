import { Users, UserCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useAdminHome } from '../hooks/useAdminHome';

export default function HomeAdm() {
    const { data, isLoading, error } = useAdminHome();

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
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Psicólogos Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <UserCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total de Psicólogos</h2>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{data?.num_psicologos || 0}</p>
                    </div>
                </div>

                {/* Pacientes Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total de Pacientes</h2>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{data?.num_pacientes || 0}</p>
                    </div>
                </div>
            </div>

            {/* Lista de Psicólogos */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mt-6">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Psicólogos em Atividade</h2>
                </div>

                {data?.psicologos && data.psicologos.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Psicólogo
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Qtd. Pacientes
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-transparent divide-y divide-slate-100 dark:divide-slate-800/60">
                                {data.psicologos.map((psicologo, index) => (
                                    <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                    <UserCircle2 className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                                                </div>
                                                <div className="text-sm font-medium text-slate-900 dark:text-slate-200">
                                                    {psicologo.nome}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-slate-600 dark:text-slate-400">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                                                {psicologo.num_pacientes}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 dark:text-slate-400">
                        <UserCircle2 className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-700" />
                        <p>Nenhum psicólogo encontrado.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
