import React from 'react';
import { FileText, Calendar, Plus, Loader2, Download } from 'lucide-react';
import type { Documento } from '../../types';

interface DocVisualizarModalProps {
    documento: Documento | null;
    onClose: () => void;
    onDownload: (doc: Documento) => void;
    isDownloading: boolean;
}

export const DocVisualizarModal: React.FC<DocVisualizarModalProps> = ({
    documento,
    onClose,
    onDownload,
    isDownloading
}) => {
    if (!documento) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{documento.nome}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                Gerado em {new Date(documento.data_criacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                {/* Conteúdo HTML */}
                <div className="overflow-y-auto flex-1 p-8 bg-slate-50/30 dark:bg-slate-900/50">
                    <div
                        className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 sm:p-12 shadow-sm border border-slate-100 dark:border-slate-700 rounded-xl prose dark:prose-invert prose-slate max-w-none
                            text-slate-900 dark:text-white
                            prose-headings:text-slate-900 dark:prose-headings:text-white
                            prose-p:text-slate-900 dark:prose-p:text-slate-100
                            prose-strong:text-slate-900 dark:prose-strong:text-white
                            prose-span:text-slate-900 dark:prose-span:text-slate-100
                        "
                        dangerouslySetInnerHTML={{ __html: documento.conteudo }}
                    />
                </div>

                {/* Footer */}
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 shrink-0">
                    <button
                        onClick={() => onDownload(documento)}
                        disabled={isDownloading}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-semibold transition-all shadow-sm shadow-primary-500/20"
                    >
                        {isDownloading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4" />
                        )}
                        Baixar PDF
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};
