import React from 'react';
import { Plus, CheckCircle, Paperclip, Loader2 } from 'lucide-react';

interface UploadAnexoModalProps {
    isOpen: boolean;
    onClose: () => void;
    file: File | null;
    setFile: (file: File | null) => void;
    descricao: string;
    setDescricao: (desc: string) => void;
    isUploading: boolean;
    onUpload: () => void;
}

export const UploadAnexoModal: React.FC<UploadAnexoModalProps> = ({
    isOpen,
    onClose,
    file,
    setFile,
    descricao,
    setDescricao,
    isUploading,
    onUpload
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Anexar Novo Arquivo</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Arquivo
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="w-full text-sm text-slate-500 dark:text-slate-400
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-xl file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-primary-50 file:text-primary-700
                                    dark:file:bg-primary-500/10 dark:file:text-primary-400
                                    hover:file:bg-primary-100 dark:hover:file:bg-primary-500/20
                                    transition-all cursor-pointer"
                            />
                            {file && (
                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Descrição
                        </label>
                        <textarea
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Ex: Resultado de exame de sangue, Encaminhamento médico..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none h-24"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row-reverse gap-3 rounded-b-2xl">
                    <button
                        onClick={onUpload}
                        disabled={isUploading || !file}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-semibold transition-all shadow-sm shadow-primary-500/20"
                    >
                        {isUploading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Paperclip className="w-4 h-4" />
                        )}
                        Anexar Arquivo
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isUploading}
                        className="flex-1 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};
