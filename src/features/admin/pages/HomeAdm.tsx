import { Users, UserCircle2, Loader2, AlertCircle } from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { useAdminHome } from '../hooks/useAdminHome';

const STATUS_COLORS = {
    ativos: '#10b981',
    inativos: '#f59e0b',
};

export default function HomeAdm() {
    const { data, isLoading, error } = useAdminHome();

    const pacientesPorStatus = [
        { name: 'Ativos', value: data?.num_pacientes_ativos ?? 0, color: STATUS_COLORS.ativos },
        { name: 'Inativos', value: data?.num_pacientes_inativos ?? 0, color: STATUS_COLORS.inativos },
    ];
    const possuiPacientes = pacientesPorStatus.some(item => item.value > 0);
    const pacientesPorPsicologo = (data?.psicologos ?? []).map(psicologo => ({
        nome: psicologo.nome,
        ativos: psicologo.num_pacientes_ativos,
        inativos: psicologo.num_pacientes_inativos,
    }));

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
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-4">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Resumo geral</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Visão consolidada dos cadastros</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-500/10">
                            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm dark:bg-blue-500/20 dark:text-blue-300">
                                <UserCircle2 className="h-5 w-5" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{data?.num_psicologos ?? 0}</p>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Psicólogos</p>
                        </div>
                        <div className="rounded-xl bg-violet-50 p-4 dark:bg-violet-500/10">
                            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-violet-600 shadow-sm dark:bg-violet-500/20 dark:text-violet-300">
                                <Users className="h-5 w-5" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{data?.num_pacientes ?? 0}</p>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Pacientes</p>
                        </div>
                    </div>

                    <div className="relative mt-3 h-52">
                        {possuiPacientes ? (
                            <>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pacientesPorStatus} dataKey="value" nameKey="name" innerRadius={58} outerRadius={78} paddingAngle={3} stroke="none">
                                            {pacientesPorStatus.map(item => <Cell key={item.name} fill={item.color} />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{data?.num_pacientes ?? 0}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">total</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">Nenhum paciente cadastrado</div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                        {pacientesPorStatus.map(item => (
                            <div key={item.name} className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                <div>
                                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{item.value}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-8">
                    <div className="mb-5">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Pacientes por psicólogo</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Comparação dos vínculos ativos e inativos</p>
                    </div>
                    {pacientesPorPsicologo.length > 0 ? (
                        <div className="h-[360px] w-full overflow-y-auto pr-2">
                            <div style={{ height: Math.max(340, pacientesPorPsicologo.length * 48) }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={pacientesPorPsicologo} layout="vertical" margin={{ top: 8, right: 20, left: 8, bottom: 8 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#cbd5e1" opacity={0.45} />
                                        <XAxis type="number" allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <YAxis type="category" dataKey="nome" width={120} tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <Tooltip cursor={{ fill: '#94a3b8', opacity: 0.1 }} />
                                        <Bar dataKey="ativos" name="Ativos" stackId="pacientes" fill={STATUS_COLORS.ativos} radius={[4, 0, 0, 4]} maxBarSize={28} />
                                        <Bar dataKey="inativos" name="Inativos" stackId="pacientes" fill={STATUS_COLORS.inativos} radius={[0, 4, 4, 0]} maxBarSize={28} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-[360px] items-center justify-center text-sm text-slate-500 dark:text-slate-400">Nenhum psicólogo cadastrado</div>
                    )}
                </section>
            </div>

            {/* Lista de Psicólogos */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mt-6">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Pacientes por psicólogo cadastrado</h2>
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
                                        Total
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                        Ativos
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                                        Inativos
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-transparent divide-y divide-slate-100 dark:divide-slate-800/60">
                                {data.psicologos.map(psicologo => (
                                    <tr key={psicologo.id_psicologo} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
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
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                {psicologo.num_pacientes_ativos}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                                                {psicologo.num_pacientes_inativos}
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
