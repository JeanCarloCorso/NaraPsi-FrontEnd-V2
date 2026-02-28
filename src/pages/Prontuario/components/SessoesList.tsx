import React from 'react';
import { ChevronDown, ChevronRight, FileText, Plus, Loader2, Calendar, Edit, Trash2, CheckCircle, Eye, Download } from 'lucide-react';
import type { Sessao } from '../types';

interface SessoesListProps {
    isOpen: boolean;
    onToggle: () => void;
    isLoading: boolean;
    sessoes: Sessao[];
    onNewSessao: () => void;
    onEditSessao: (sessao: Sessao) => void;
    onDeleteSessao: (sessao: Sessao) => void;
    onConcluirSessao: (sessao: Sessao) => void;
    onVisualizeSessao: (sessao: Sessao) => void;
    onDownloadSessao: (sessao: Sessao) => void;
    isDownloading: number | null;
}

export const SessoesList: React.FC<SessoesListProps> = ({
    isOpen,
    onToggle,
    isLoading,
    sessoes,
    onNewSessao,
    onEditSessao,
    onDeleteSessao,
    onConcluirSessao,
    onVisualizeSessao,
    onDownloadSessao,
    isDownloading
}) => {
    return (
        <section className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col transition-all overflow-hidden ${isOpen ? 'min-h-[400px]' : ''}`}>
            <div className={`flex items-center justify-between ${isOpen ? 'mb-6 pb-4 border-b border-slate-100 dark:border-slate-800' : ''}`}>
                <button onClick={onToggle} className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-1 text-left">
                    {isOpen ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                    <FileText className="w-5 h-5 text-primary-500" />
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Sessões Terapêuticas</h2>
                </button>
                <button
                    onClick={onNewSessao}
                    className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors z-10 relative"
                >
                    <Plus className="w-4 h-4" />
                    Adicionar
                </button>
            </div>

            {isOpen && isLoading && (
                <div className="flex-1 flex items-center justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
            )}

            {isOpen && !isLoading && sessoes.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-in fade-in slide-in-from-top-4">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    </div>
                    <h3 className="text-slate-700 dark:text-slate-200 font-medium mb-1">Nenhuma sessão registrada.</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                        Comece documentando o progresso do paciente criando a primeira anotação de sessão.
                    </p>
                    <button
                        onClick={onNewSessao}
                        className="px-5 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Registrar Sessão
                    </button>
                </div>
            )}

            {isOpen && !isLoading && sessoes.length > 0 && (
                <div className="flex-1 space-y-4 mt-2 animate-in fade-in slide-in-from-top-4">
                    {sessoes.map((sessao) => (
                        <div key={sessao.id_sessao} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 sm:px-6 border border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <div className="font-medium text-slate-800 dark:text-slate-200">
                                    Sessão #{sessao.id_sessao}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(sessao.data_sessao + "T12:00:00").toLocaleDateString('pt-BR')}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${sessao.situacao === 'CONCLUIDO'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                                    }`}>
                                    {sessao.situacao === 'CONCLUIDO' ? 'CONCLUÍDO' : 'EDITANDO'}
                                </span>

                                <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 dark:border-slate-700 pl-3">
                                    {sessao.situacao === 'EDITANDO' ? (
                                        <>
                                            <button
                                                onClick={() => onEditSessao(sessao)}
                                                className="p-1.5 text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all shadow-sm"
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteSessao(sessao)}
                                                className="p-1.5 text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-all shadow-sm"
                                                title="Excluir"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onConcluirSessao(sessao)}
                                                className="p-1.5 text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-all shadow-sm"
                                                title="Concluir"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => onVisualizeSessao(sessao)}
                                                className="p-1.5 text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-all shadow-sm"
                                                title="Visualizar relato"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDownloadSessao(sessao)}
                                                disabled={isDownloading === sessao.id_sessao}
                                                className="p-1.5 text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Baixar relato"
                                            >
                                                {isDownloading === sessao.id_sessao
                                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                                    : <Download className="w-4 h-4" />}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};
