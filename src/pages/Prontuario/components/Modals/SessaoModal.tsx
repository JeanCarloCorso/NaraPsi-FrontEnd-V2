import React from 'react';
import { Plus, Calendar, FileText, Loader2, CheckCircle } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';

interface SessaoModalProps {
    isOpen: boolean;
    onClose: () => void;
    sessaoEdicaoId: number | null;
    formSessaoData: string;
    setFormSessaoData: (val: string) => void;
    formSessaoConteudo: string;
    setFormSessaoConteudo: (val: string) => void;
    isSaving: boolean;
    onSave: () => void;
    fieldErrors: Record<string, string>;
}

export const SessaoModal: React.FC<SessaoModalProps> = ({
    isOpen,
    onClose,
    sessaoEdicaoId,
    formSessaoData,
    setFormSessaoData,
    formSessaoConteudo,
    setFormSessaoConteudo,
    isSaving,
    onSave,
    fieldErrors
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => !isSaving && onClose()}
        >
            <div
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            {sessaoEdicaoId ? 'Editar Sessão' : 'Registrar Nova Sessão'}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {sessaoEdicaoId ? `Editando registro da sessão #${sessaoEdicaoId}` : 'Documente o progresso do atendimento'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                {/* Conteúdo do formulário */}
                <div className="overflow-y-auto flex-1 p-6 space-y-6">
                    {/* Campo de Data */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            Data da Sessão
                        </label>
                        <input
                            type="date"
                            value={formSessaoData}
                            onChange={(e) => setFormSessaoData(e.target.value)}
                            className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border ${fieldErrors.data ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-slate-900 dark:text-white transition-all`}
                        />
                        {fieldErrors.data && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.data}</p>}
                    </div>

                    {/* Campo de Relato (TinyMCE) */}
                    <div className="flex flex-col h-[400px]">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-400" />
                            Relato da Sessão
                        </label>
                        <div className={`flex-1 flex flex-col overflow-hidden border ${fieldErrors.conteudo ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl bg-white dark:bg-slate-900 min-h-[400px]`}>
                            <Editor
                                apiKey={import.meta.env.VITE_API_TINY_KEY}
                                value={formSessaoConteudo}
                                onEditorChange={(content) => setFormSessaoConteudo(content)}
                                init={{
                                    height: '100%',
                                    menubar: false,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic underline | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size:14px }',
                                    skin: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oxide-dark' : 'oxide',
                                    content_css: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default',
                                }}
                            />
                        </div>
                        {fieldErrors.conteudo && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.conteudo}</p>}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 shrink-0">
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-semibold transition-all shadow-sm shadow-primary-500/20"
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <CheckCircle className="w-4 h-4" />
                        )}
                        {sessaoEdicaoId ? 'Salvar Alterações' : 'Salvar Registro'}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="flex-1 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};
