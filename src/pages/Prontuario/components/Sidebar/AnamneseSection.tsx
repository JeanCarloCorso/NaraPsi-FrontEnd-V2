import React from 'react';
import { FileEdit } from 'lucide-react';

interface AnamneseSectionProps {
    onOpen: () => void;
}

export const AnamneseSection: React.FC<AnamneseSectionProps> = ({ onOpen }) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Anamnese</h3>
            <div className="space-y-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Acesse o histórico clínico e queixas principais do paciente para guiar o atendimento.
                </p>
                <button
                    onClick={onOpen}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl font-medium transition-all"
                >
                    <FileEdit className="w-4 h-4" />
                    Ver Anamnese
                </button>
            </div>
        </div>
    );
};
