import React from 'react';
import { FileEdit, Plus, Loader2, CheckCircle } from 'lucide-react';
import type { Anamnese } from '../../types';

interface AnamneseModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: Anamnese | null;
    isLoading: boolean;
    isSaving: boolean;
    onSave: () => void;
    onUpdateField: (field: keyof Anamnese, value: any) => void;
}

export const AnamneseModal: React.FC<AnamneseModalProps> = ({
    isOpen,
    onClose,
    data,
    isLoading,
    isSaving,
    onSave,
    onUpdateField
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => !isSaving && onClose()}
        >
            <div
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
                            <FileEdit className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Anamnese do Paciente</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Histórico detalhado e queixas</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="overflow-y-auto flex-1 p-6 space-y-8">
                    {isLoading || !data ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                            <p className="text-slate-500 dark:text-slate-400 animate-pulse">Carregando anamnese...</p>
                        </div>
                    ) : (
                        <>
                            {/* Seção 1: Identificação e Contexto */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l-2 border-primary-500 pl-2">Contexto e Perfil</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Profissão</label>
                                        <input
                                            type="text"
                                            value={data.profissao}
                                            onChange={(e) => onUpdateField('profissao', e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Escolaridade</label>
                                        <input
                                            type="text"
                                            value={data.escolaridade}
                                            onChange={(e) => onUpdateField('escolaridade', e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Religião</label>
                                        <input
                                            type="text"
                                            value={data.religião}
                                            onChange={(e) => onUpdateField('religiao', e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Hobbies e Atividades</label>
                                        <input
                                            type="text"
                                            value={data.hobbies}
                                            onChange={(e) => onUpdateField('hobbies', e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Seção 2: Queixa do Paciente */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l-2 border-primary-500 pl-2">A Queixa</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Queixa Principal (MOTIVO)</label>
                                        <textarea
                                            value={data.queixa_principal}
                                            onChange={(e) => onUpdateField('queixa_principal', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all resize-none"
                                            placeholder="Qual o motivo principal da busca pelo atendimento?"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Evolução da Queixa</label>
                                        <textarea
                                            value={data.evolucao_queixa}
                                            onChange={(e) => onUpdateField('evolucao_queixa', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all resize-none"
                                            placeholder="Como e quando os sintomas começaram e como evoluíram?"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Seção 3: Histórico e Saúde */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l-2 border-primary-500 pl-2">Saúde e Histórico</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Estrutura Familiar</label>
                                        <textarea
                                            value={data.estrutura_familiar}
                                            onChange={(e) => onUpdateField('estrutura_familiar', e.target.value)}
                                            rows={2}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all resize-none"
                                            placeholder="Quem mora com o paciente? Como é o núcleo familiar?"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Qualidade do Sono</label>
                                        <input
                                            type="text"
                                            value={data.qualidade_sono}
                                            onChange={(e) => onUpdateField('qualidade_sono', e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Medicamentos em Uso</label>
                                        <input
                                            type="text"
                                            value={data.medicamentos}
                                            onChange={(e) => onUpdateField('medicamentos', e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Histórico Familiar relevante</label>
                                        <textarea
                                            value={data.historico_familiar}
                                            onChange={(e) => onUpdateField('historico_familiar', e.target.value)}
                                            rows={2}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all resize-none"
                                            placeholder="Casos de transtornos mentais, doenças graves ou eventos marcantes na família."
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Traumas Relevantes</label>
                                        <textarea
                                            value={data.trauma_relevante}
                                            onChange={(e) => onUpdateField('trauma_relevante', e.target.value)}
                                            rows={2}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all resize-none"
                                            placeholder="Lutos, separações, acidentes ou outros traumas."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Seção 4: História Pregressa e Anotações */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l-2 border-primary-500 pl-2">História e Notas</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">História Pregressa</label>
                                        <textarea
                                            value={data.historia_pregressa}
                                            onChange={(e) => onUpdateField('historia_pregressa', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all resize-none"
                                            placeholder="Antecedentes pessoais, desenvolvimento e tratamentos anteriores."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Anotações Gerais</label>
                                        <textarea
                                            value={data.anotacoes_gerais}
                                            onChange={(e) => onUpdateField('anotacoes_gerais', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all resize-none"
                                            placeholder="Observações adicionais..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 shrink-0">
                    <button
                        onClick={onSave}
                        disabled={isSaving || isLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-semibold transition-all shadow-sm shadow-primary-500/20"
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <CheckCircle className="w-4 h-4" />
                        )}
                        Salvar Anamnese
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};
