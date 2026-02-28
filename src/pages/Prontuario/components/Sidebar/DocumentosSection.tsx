import React from 'react';
import { ChevronDown, ChevronRight, FileEdit, Plus, Loader2, FileText, Download, Eye } from 'lucide-react';
import type { Documento } from '../../types';

interface DocumentosSectionProps {
    isOpen: boolean;
    onToggle: () => void;
    isLoading: boolean;
    documentos: Documento[];
    onView: (doc: Documento) => void;
    onDownload: (doc: Documento) => void;
    isDownloadingDoc: number | null;
}

export const DocumentosSection: React.FC<DocumentosSectionProps> = ({
    isOpen,
    onToggle,
    isLoading,
    documentos,
    onView,
    onDownload,
    isDownloadingDoc
}) => {
    return (
        <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-all overflow-hidden">
            <div className={`flex items-center justify-between ${isOpen ? 'mb-4 pb-3 border-b border-slate-100 dark:border-slate-800' : ''}`}>
                <button onClick={onToggle} className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-1 text-left">
                    {isOpen ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                    <FileEdit className="w-5 h-5 text-indigo-500" />
                    <h2 className="font-semibold text-slate-800 dark:text-slate-100">Documentos</h2>
                </button>
                <button className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-slate-50 dark:hover:bg-primary-500/10 transition-colors z-10 relative">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {isOpen && (
                <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-4">
                    {isLoading ? (
                        <div className="flex justify-center py-6">
                            <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                        </div>
                    ) : documentos.length === 0 ? (
                        <div className="py-8 text-center flex flex-col items-center">
                            <FileEdit className="w-8 h-8 text-slate-200 dark:text-slate-700 mb-2" />
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Nenhum documento gerado.</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Laudos, atestados ou declarações aparecerão aqui.</p>
                        </div>
                    ) : (
                        documentos.map((doc) => (
                            <div
                                key={doc.id_documento}
                                className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 hover:border-primary-200 dark:hover:border-primary-500/30 transition-all"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                                        <FileText className="w-4.5 h-4.5 text-indigo-500" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate pr-2" title={doc.nome}>
                                            {doc.nome}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                                {new Date(doc.data_criacao).toLocaleDateString('pt-BR')}
                                            </span>
                                            {doc.assinaturas && doc.assinaturas.some(s => s.status === 'signed') && (
                                                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 uppercase tracking-tighter">
                                                    Assinado
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                                    <button
                                        onClick={() => onView(doc)}
                                        className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors shadow-sm"
                                        title="Visualizar documento"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDownload(doc)}
                                        disabled={isDownloadingDoc === doc.id_documento}
                                        className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                                        title="Baixar PDF"
                                    >
                                        {isDownloadingDoc === doc.id_documento ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Download className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </section>
    );
};
