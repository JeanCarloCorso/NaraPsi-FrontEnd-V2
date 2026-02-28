import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, PartyPopper, Loader2 } from 'lucide-react';
import api from '../services/api';
import { maskPhone } from '../utils/masks';

interface HomeData {
    total_pacientes_masculino: number;
    total_pacientes_feminino: number;
    aniversariantes_do_dia: {
        nome: string;
        idade: number;
        telefone: string | null;
    }[];
}

const COLORS = ['#3b82f6', '#ec4899']; // Blue, Pink

export default function Home() {
    const [data, setData] = useState<HomeData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const response = await api.get('/home');
                setData(response.data);
            } catch (err: any) {
                setError(err.message || 'Erro ao carregar dados do dashboard');
            } finally {
                setIsLoading(false);
            }
        };

        fetchHomeData();
    }, []);

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
                <p>{error}</p>
            </div>
        );
    }

    const pieData = [
        { name: 'Masculino', value: data?.total_pacientes_masculino || 0 },
        { name: 'Feminino', value: data?.total_pacientes_feminino || 0 },
    ];

    const totalPacientes = (data?.total_pacientes_masculino || 0) + (data?.total_pacientes_feminino || 0);

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pacientes Chart Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 tracking-tight">Pacientes</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total: {totalPacientes}</p>
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        {totalPacientes > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tw-colors-slate-800, #1e293b)', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: 'inherit' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                                Nenhum paciente cadastrado
                            </div>
                        )}
                    </div>
                </div>

                {/* Aniversariantes Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center">
                            <PartyPopper className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 tracking-tight">Aniversariantes do Dia</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{data?.aniversariantes_do_dia?.length || 0} comemorando hoje</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {data?.aniversariantes_do_dia && data.aniversariantes_do_dia.length > 0 ? (
                            <div className="space-y-3">
                                {data.aniversariantes_do_dia.map((pessoa, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                        <div>
                                            <p className="font-medium text-slate-800 dark:text-slate-200">{pessoa.nome}</p>
                                            {pessoa.telefone && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{maskPhone(pessoa.telefone)}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-flex items-center justify-center bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-semibold">
                                                {pessoa.idade} anos
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 min-h-[160px]">
                                <PartyPopper className="w-8 h-8 text-slate-200 dark:text-slate-700 mb-2" />
                                <p>Nenhum aniversariante hoje</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
