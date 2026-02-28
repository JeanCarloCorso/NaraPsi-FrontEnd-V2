import React from 'react';
import { AlertCircle, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import type { Sessao } from '../../types';

interface ConfirmacaoExclusaoModalProps {
    sessao: Sessao | null;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
}

export const ConfirmacaoExclusaoModal: React.FC<ConfirmacaoExclusaoModalProps> = ({
    sessao,
    onClose,
    onConfirm,
    isDeleting
}) => {
    if (!sessao) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-4 text-red-600 dark:text-red-400 mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">Excluir Sessão?</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Tem certeza que deseja excluir o relato da sessão de <strong>{new Date(sessao.data_sessao).toLocaleDateString('pt-BR')}</strong>?
                    Esta ação não pode ser desfeita e todos os dados desta sessão serão perdidos.
                </p>
                <div className="flex flex-col sm:flex-row-reverse gap-3">
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
                    >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Sim, Excluir
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ConfirmacaoConclusaoModalProps {
    sessao: Sessao | null;
    onClose: () => void;
    onConfirm: () => void;
    isFinishing: boolean;
}

export const ConfirmacaoConclusaoModal: React.FC<ConfirmacaoConclusaoModalProps> = ({
    sessao,
    onClose,
    onConfirm,
    isFinishing
}) => {
    if (!sessao) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-4 text-amber-600 dark:text-amber-400 mb-4">
                    <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">Concluir Sessão?</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Ao concluir a sessão de <strong>{new Date(sessao.data_sessao).toLocaleDateString('pt-BR')}</strong>, o relato tornará-se <strong>imutável</strong> (não poderá mais ser editado ou excluído).
                    Deseja prosseguir com a finalização definitiva?
                </p>
                <div className="flex flex-col sm:flex-row-reverse gap-3">
                    <button
                        onClick={onConfirm}
                        disabled={isFinishing}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-colors"
                    >
                        {isFinishing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <CheckCircle className="w-4 h-4" />
                        )}
                        Confirmar Conclusão
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isFinishing}
                        className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};
