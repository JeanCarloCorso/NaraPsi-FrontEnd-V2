import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, UserCircle2, Calendar, Activity, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';

interface Paciente {
    id: number;
    nome: string;
    sexo: string;
    idade: number;
    ultima_data_sessao: string | null;
}

export default function Pacientes() {
    const navigate = useNavigate();
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const response = await api.get('/pacientes');
                setPacientes(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Erro ao carregar a lista de pacientes.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPacientes();
    }, []);

    // Memoize the filtered list so we don't recalculate on every render unless deps change
    const filteredPacientes = useMemo(() => {
        // Only apply filter if the search term has 3 or more characters
        if (searchTerm.trim().length >= 3) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            return pacientes.filter(p =>
                p.nome.toLowerCase().includes(lowerCaseSearch) ||
                p.sexo.toLowerCase().includes(lowerCaseSearch)
            );
        }
        return pacientes;
    }, [pacientes, searchTerm]);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return <span className="text-slate-400 dark:text-slate-500 italic">Sem sessões</span>;

        // Handling YYYY-MM-DD backend possible format
        const dateObj = new Date(dateString);
        if (isNaN(dateObj.getTime())) return dateString;

        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
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
                        placeholder="Buscar por nome ou sexo (min. 3 letras)..."
                        className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl leading-5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors shadow-sm"
                    />
                </div>

                <button
                    className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm shadow-primary-500/30 flex items-center justify-center gap-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Novo Paciente
                </button>
            </div>

            {/* Patients List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                {filteredPacientes.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Paciente
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Sexo
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Idade
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Última Sessão
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-transparent divide-y divide-slate-100 dark:divide-slate-800/60">
                                {filteredPacientes.map((paciente) => (
                                    <tr
                                        key={paciente.id}
                                        onClick={() => navigate(`/pacientes/${paciente.id}`)}
                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                    <UserCircle2 className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                                                </div>
                                                <div className="text-sm font-medium text-slate-900 dark:text-slate-200">
                                                    {paciente.nome}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                ${paciente.sexo.toLowerCase() === 'feminino'
                                                    ? 'bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-500/20'
                                                    : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'}
                                            `}>
                                                {paciente.sexo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                            {paciente.idade} anos
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                {formatDate(paciente.ultima_data_sessao)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors px-3 py-1 flex items-center gap-1 ml-auto">
                                                <Activity className="w-4 h-4" />
                                                Prontuário
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
                            {searchTerm.length >= 3 ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                            {searchTerm.length >= 3
                                ? `Não encontramos resultados para "${searchTerm}". Tente uma busca diferente.`
                                : 'Você ainda não possui pacientes. Clique no botão "Novo Paciente" para começar.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
