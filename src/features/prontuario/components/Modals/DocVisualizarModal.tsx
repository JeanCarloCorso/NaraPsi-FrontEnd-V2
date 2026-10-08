import React from 'react';
import { FileText, Calendar, Plus, Loader2, Download, Edit3, Save, Send, CheckCircle2 } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import type { Documento } from '@features/prontuario/types';
import { sanitizeHtml } from '@shared/utils/sanitizeHtml';

interface DocVisualizarModalProps {
    documento: Documento | null;
    onClose: () => void;
    onDownload: (doc: Documento) => void;
    isDownloading: boolean;
    isEditing: boolean;
    conteudo: string;
    isSaving: boolean;
    isSigning: boolean;
    isFinalizing: boolean;
    onStartEdit: (doc: Documento) => void;
    onCancelEdit: () => void;
    onChangeConteudo: (conteudo: string) => void;
    onSave: () => void;
    onSign: () => void;
    onFinalize: () => void;
}

export const DocVisualizarModal: React.FC<DocVisualizarModalProps> = ({
    documento,
    onClose,
    onDownload,
    isDownloading,
    isEditing,
    conteudo,
    isSaving,
    isSigning,
    isFinalizing,
    onStartEdit,
    onCancelEdit,
    onChangeConteudo,
    onSave,
    onSign,
    onFinalize,
}) => {
    if (!documento) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="documento-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-2 backdrop-blur-sm animate-in fade-in duration-200 sm:p-4"
            onClick={onClose}
        >
            <div
                style={{ maxHeight: 'calc(100dvh - 1rem)' }}
                className="flex w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200 dark:border-slate-700 dark:bg-slate-900"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4 dark:border-slate-800">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
                            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="min-w-0">
                            <h3 id="documento-modal-title" className="break-words text-lg font-semibold text-slate-800 dark:text-slate-100">{documento.nome}</h3>
                            <p className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                                <Calendar className="w-3.5 h-3.5" />
                                Gerado em {new Date(documento.data_criacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <button
                        aria-label="Fechar visualização do documento"
                        onClick={onClose}
                        className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    >
                        <Plus className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-2 text-xs sm:px-6 dark:border-slate-800">
                    <span className={`rounded-full px-2.5 py-1 font-semibold ${documento.status === 'RASCUNHO' ? 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400' : documento.status === 'ASSINADO' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                        {documento.status.replaceAll('_', ' ').toLocaleLowerCase('pt-BR')}
                    </span>
                    {documento.status === 'RASCUNHO' && <span className="text-slate-500">Pode ser editado até a finalização.</span>}
                </div>

                {documento.assinaturas?.length > 0 && (
                    <div className="flex shrink-0 flex-wrap gap-2 border-b border-slate-100 px-4 py-2 sm:px-6 dark:border-slate-800">
                        {documento.assinaturas.map((assinatura, index) => (
                            <span key={`${assinatura.id_pessoa}-${index}`} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${assinatura.status === 'signed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'}`}>
                                {assinatura.tipo_assinatura}: {assinatura.status === 'signed' ? 'assinado' : 'aguardando'}
                            </span>
                        ))}
                    </div>
                )}

                {/* Conteúdo HTML */}
                <div className="min-h-0 flex-1 overflow-auto bg-slate-200 p-3 sm:p-6 dark:bg-slate-950">
                    {isEditing ? (
                        <div className="mx-auto min-h-[600px] max-w-[210mm] overflow-auto border border-slate-300 bg-white shadow-xl">
                            <Editor
                                apiKey={import.meta.env.VITE_API_TINY_KEY}
                                value={conteudo}
                                onEditorChange={onChangeConteudo}
                                init={{
                                    height: 600,
                                    menubar: false,
                                    plugins: ['advlist', 'autolink', 'lists', 'link', 'charmap', 'preview', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'table', 'help', 'wordcount'],
                                    toolbar: 'undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code',
                                    content_style: `
                                        html { background: #e2e8f0; }
                                        body {
                                            box-sizing: border-box;
                                            width: 210mm;
                                            min-height: 297mm;
                                            margin: 0 auto;
                                            padding: 18mm 20mm;
                                            background: #fff;
                                            color: #111827;
                                            font-family: "Times New Roman", Times, serif;
                                            font-size: 12pt;
                                            line-height: 1.5;
                                            box-shadow: 0 12px 30px rgba(15, 23, 42, .18);
                                        }
                                        table { max-width: 100%; border-collapse: collapse; }
                                        img { max-width: 100%; height: auto; }
                                    `,
                                }}
                            />
                        </div>
                    ) : (
                        <div className="mx-auto w-fit">
                            <p className="mb-2 text-center text-xs font-medium text-slate-600 dark:text-slate-400">
                                Pré-visualização em folha A4
                            </p>
                            <article
                                className="min-h-[297mm] w-[210mm] border border-slate-300 bg-white px-[20mm] py-[18mm] text-[12pt] leading-[1.5] text-slate-950 shadow-xl [&_img]:h-auto [&_img]:max-w-full [&_table]:max-w-full [&_table]:border-collapse"
                                style={{ fontFamily: '"Times New Roman", Times, serif' }}
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(documento.conteudo) }}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex shrink-0 flex-col gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row-reverse sm:px-6 dark:border-slate-800 dark:bg-slate-800/50">
                    {isEditing ? (
                        <>
                            <button onClick={onSave} disabled={isSaving || !conteudo.trim()} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 font-semibold text-white hover:bg-primary-700 disabled:bg-primary-400">
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Salvar alterações
                            </button>
                            <button onClick={onCancelEdit} disabled={isSaving} className="flex-1 rounded-xl border border-slate-200 bg-white px-6 py-2.5 font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">Cancelar edição</button>
                        </>
                    ) : <>
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
                    {documento.status === 'FINALIZADO' && documento.assinaturas?.length === 0 && (
                        <button onClick={onSign} disabled={isSigning} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:bg-emerald-400">
                            {isSigning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Enviar para assinatura
                        </button>
                    )}
                    {documento.status === 'RASCUNHO' && (
                        <button onClick={() => onStartEdit(documento)} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2.5 font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"><Edit3 className="h-4 w-4" />Editar</button>
                    )}
                    {documento.status === 'RASCUNHO' && (
                        <button onClick={onFinalize} disabled={isFinalizing} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:bg-emerald-400">
                            {isFinalizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}Finalizar
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold transition-colors"
                    >
                        Fechar
                    </button>
                    </>}
                </div>
            </div>
        </div>
    );
};
