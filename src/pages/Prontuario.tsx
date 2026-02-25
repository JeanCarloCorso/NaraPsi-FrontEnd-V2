import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    UserCircle2, Phone, Calendar,
    Edit, FileText, FileEdit, Paperclip, Plus, ArrowLeft, Loader2, AlertCircle, ChevronDown, ChevronRight
} from 'lucide-react';
import api from '../services/api';

interface PacienteDetalhe {
    id: number;
    nome: string;
    sexo: string;
    idade: number;
    telefones?: { numero: string; descricao?: string }[];
    ultima_data_sessao: string | null;
}

export default function Prontuario() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState<PacienteDetalhe | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [sectionsOpen, setSectionsOpen] = useState({
        sessoes: false,
        documentos: false,
        arquivos: false
    });

    const toggleSection = (section: keyof typeof sectionsOpen) => {
        setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
    };

    useEffect(() => {
        const fetchPaciente = async () => {
            try {
                // Tenta buscar o paciente específico (Assumindo rota REST padrão)
                const response = await api.get(`/pacientes/${id}`);
                setPaciente(response.data);
            } catch (err: any) {
                // Fallback local se a API de detalhe não existir usando a listagem completa
                if (err.response?.status === 404) {
                    try {
                        const allResponse = await api.get('/pacientes');
                        const found = allResponse.data.find((p: any) => p.id === Number(id));
                        if (found) {
                            setPaciente(found);
                        } else {
                            setError('Paciente não encontrado.');
                        }
                    } catch (fallbackErr) {
                        setError('Erro ao carregar os dados do paciente.');
                    }
                } else {
                    setError('Erro ao carregar os dados do paciente.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchPaciente();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    if (error || !paciente) {
        return (
            <div className="bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-500/20 flex flex-col items-center justify-center gap-3 min-h-[300px]">
                <AlertCircle className="w-8 h-8 shrink-0 mb-2" />
                <p className="font-medium text-lg">{error || 'Paciente não encontrado'}</p>
                <button onClick={() => navigate('/pacientes')} className="mt-4 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Voltar para Pacientes</button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            {/* Botão Voltar */}
            <button
                onClick={() => navigate('/pacientes')}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Voltar para Lista
            </button>

            {/* Cabeçalho do Prontuário */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center shrink-0">
                        <UserCircle2 className="w-8 h-8 text-primary-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">{paciente.nome}</h1>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                {paciente.idade} anos
                            </span>
                            <span className={`px-2.5 py-1 rounded-md border font-medium
                                ${paciente.sexo.toLowerCase() === 'feminino'
                                    ? 'bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-500/20'
                                    : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'}
                            `}>
                                {paciente.sexo}
                            </span>
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                {paciente.telefones && paciente.telefones.length > 0 ? paciente.telefones[0].numero : 'Não informado'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex w-full md:w-auto gap-3">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl font-medium transition-colors shadow-sm">
                        <Edit className="w-4 h-4" />
                        Editar Dados
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-sm shadow-primary-500/30">
                        <FileEdit className="w-4 h-4" />
                        Anamnese
                    </button>
                </div>
            </div>

            {/* Grid de Seções */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Coluna Principal (Sessões) */}
                <div className="lg:col-span-2 space-y-6">
                    <section className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col transition-all overflow-hidden ${sectionsOpen.sessoes ? 'min-h-[400px]' : ''}`}>
                        <div className={`flex items-center justify-between ${sectionsOpen.sessoes ? 'mb-6 pb-4 border-b border-slate-100 dark:border-slate-800' : ''}`}>
                            <button onClick={() => toggleSection('sessoes')} className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-1 text-left">
                                {sectionsOpen.sessoes ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                                <FileText className="w-5 h-5 text-primary-500" />
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Sessões Terapêuticas</h2>
                            </button>
                            <button className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors z-10 relative">
                                <Plus className="w-4 h-4" />
                                Adicionar
                            </button>
                        </div>

                        {/* Empty State das Sessões */}
                        {sectionsOpen.sessoes && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-in fade-in slide-in-from-top-4">
                                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                                    <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                                </div>
                                <h3 className="text-slate-700 dark:text-slate-200 font-medium mb-1">Nenhuma sessão registrada.</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                                    Comece documentando o progresso do paciente criando a primeira anotação de sessão.
                                </p>
                                <button className="px-5 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Registrar Sessão
                                </button>
                            </div>
                        )}
                    </section>
                </div>

                {/* Coluna Lateral (Documentos e Arquivos) */}
                <div className="space-y-6">

                    {/* Documentos */}
                    <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-all overflow-hidden">
                        <div className={`flex items-center justify-between ${sectionsOpen.documentos ? 'mb-4 pb-3 border-b border-slate-100 dark:border-slate-800' : ''}`}>
                            <button onClick={() => toggleSection('documentos')} className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-1 text-left">
                                {sectionsOpen.documentos ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                                <FileEdit className="w-5 h-5 text-indigo-500" />
                                <h2 className="font-semibold text-slate-800 dark:text-slate-100">Documentos</h2>
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-slate-50 dark:hover:bg-primary-500/10 transition-colors z-10 relative">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Empty State */}
                        {sectionsOpen.documentos && (
                            <div className="py-8 text-center flex flex-col items-center animate-in fade-in slide-in-from-top-4">
                                <FileEdit className="w-8 h-8 text-slate-200 dark:text-slate-700 mb-2" />
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Nenhum documento gerado.</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Laudos, atestados ou declarações aparecerão aqui.</p>
                            </div>
                        )}
                    </section>

                    {/* Arquivos Anexados */}
                    <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-all overflow-hidden">
                        <div className={`flex items-center justify-between ${sectionsOpen.arquivos ? 'mb-4 pb-3 border-b border-slate-100 dark:border-slate-800' : ''}`}>
                            <button onClick={() => toggleSection('arquivos')} className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-1 text-left">
                                {sectionsOpen.arquivos ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                                <Paperclip className="w-5 h-5 text-emerald-500" />
                                <h2 className="font-semibold text-slate-800 dark:text-slate-100">Arquivos Anexados</h2>
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-slate-50 dark:hover:bg-primary-500/10 transition-colors z-10 relative">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Empty State */}
                        {sectionsOpen.arquivos && (
                            <div className="py-8 text-center flex flex-col items-center animate-in fade-in slide-in-from-top-4">
                                <Paperclip className="w-8 h-8 text-slate-200 dark:text-slate-700 mb-2" />
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Nenhum arquivo anexado.</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Faça upload de exames e PDFs importantes.</p>
                            </div>
                        )}
                    </section>

                </div>

            </div>
        </div>
    );
}
