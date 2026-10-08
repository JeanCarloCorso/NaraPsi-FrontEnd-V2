import { ArrowLeft, Eye, FilePlus2, Loader2, Plus, Save } from 'lucide-react';
import type { TipoDocumento, VariavelDocumento } from '@features/prontuario/types';
import { sanitizeHtml } from '@shared/utils/sanitizeHtml';

interface GerarDocumentoModalProps {
    isOpen: boolean;
    tipos: TipoDocumento[];
    tipoSelecionado: number | null;
    variaveis: VariavelDocumento[];
    valores: Record<string, string>;
    isLoadingTipos: boolean;
    isLoadingVariaveis: boolean;
    isGenerating: boolean;
    preview: string;
    error: string;
    onSelectTipo: (tipoId: number) => void;
    onChangeValor: (nome: string, valor: string) => void;
    onPreview: () => void;
    onGenerate: () => void;
    onBackToFields: () => void;
    onClose: () => void;
}

export function GerarDocumentoModal({
    isOpen,
    tipos,
    tipoSelecionado,
    variaveis,
    valores,
    isLoadingTipos,
    isLoadingVariaveis,
    isGenerating,
    preview,
    error,
    onSelectTipo,
    onChangeValor,
    onPreview,
    onGenerate,
    onBackToFields,
    onClose,
}: GerarDocumentoModalProps) {
    if (!isOpen) return null;
    const busy = isLoadingTipos || isLoadingVariaveis || isGenerating;

    return (
        <div role="dialog" aria-modal="true" aria-labelledby="gerar-documento-title" className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-2 backdrop-blur-sm sm:p-4" onClick={() => !busy && onClose()}>
            <div style={{ maxHeight: 'calc(100dvh - 1rem)' }} className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900" onClick={(event) => event.stopPropagation()}>
                <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4 dark:border-slate-800">
                    <div className="min-w-0">
                        <h2 id="gerar-documento-title" className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white"><FilePlus2 className="h-5 w-5 text-indigo-500" />Gerar documento</h2>
                        <p className="mt-1 break-words text-sm text-slate-500 dark:text-slate-400">{preview ? 'Revise a prévia antes de criar o rascunho.' : 'Escolha o modelo e confira os dados solicitados.'}</p>
                    </div>
                    <button type="button" aria-label="Fechar geração de documento" disabled={busy} onClick={onClose} className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"><Plus className="h-5 w-5 rotate-45" /></button>
                </header>

                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
                    {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">{error}</div>}

                    {!preview && <div>
                        <label htmlFor="tipo-documento" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Tipo de documento</label>
                        <select id="tipo-documento" value={tipoSelecionado ?? ''} disabled={busy} onChange={(event) => onSelectTipo(Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                            <option value="">Selecione um modelo</option>
                            {tipos.map((tipo) => <option key={tipo.id_tipo_documento} value={tipo.id_tipo_documento}>{tipo.nome} — {tipo.descricao}</option>)}
                        </select>
                    </div>}

                    {preview ? (
                        <div className="overflow-auto rounded-xl bg-slate-200 p-2 sm:p-3 dark:bg-slate-950">
                            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300"><Eye className="h-4 w-4" />Prévia do documento</div>
                            <article
                                className="mx-auto min-h-[500px] min-w-[min(210mm,100%)] max-w-[210mm] overflow-hidden bg-white px-4 py-6 text-slate-950 shadow-lg sm:px-8 sm:py-10 [&_img]:h-auto [&_img]:max-w-full [&_table]:w-full"
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(preview) }}
                            />
                        </div>
                    ) : isLoadingTipos || isLoadingVariaveis ? (
                        <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500"><Loader2 className="h-5 w-5 animate-spin" />Carregando modelo...</div>
                    ) : tipoSelecionado && variaveis.length === 0 && !error ? (
                        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">Este modelo não exige preenchimento manual. Os demais dados serão obtidos do prontuário.</div>
                    ) : (
                        variaveis.map((variavel) => (
                            <div key={variavel.nome_variavel}>
                                <label htmlFor={`doc-var-${variavel.nome_variavel}`} className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{variavel.texto_exibido_usuario || variavel.nome_variavel}</label>
                                <textarea id={`doc-var-${variavel.nome_variavel}`} rows={3} value={valores[variavel.nome_variavel] ?? ''} disabled={isGenerating} onChange={(event) => onChangeValor(variavel.nome_variavel, event.target.value)} className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                            </div>
                        ))
                    )}
                </div>

                <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:justify-end sm:px-6 dark:border-slate-800 dark:bg-slate-800/50">
                    <button type="button" disabled={busy} onClick={preview ? onBackToFields : onClose} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {preview && <ArrowLeft className="h-4 w-4" />}{preview ? 'Revisar campos' : 'Cancelar'}
                    </button>
                    <button type="button" disabled={!tipoSelecionado || busy || !!error} onClick={preview ? onGenerate : onPreview} className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 font-semibold text-white hover:bg-primary-700 disabled:bg-primary-400">
                        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : preview ? <Save className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {preview ? 'Criar rascunho' : 'Gerar prévia'}
                    </button>
                </footer>
            </div>
        </div>
    );
}
