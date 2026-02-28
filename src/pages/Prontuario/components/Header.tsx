import React from 'react';
import { ArrowLeft, UserCircle2, Calendar, Phone, Edit, FileEdit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { PacienteDetalhe } from '../types';

interface HeaderProps {
    paciente: PacienteDetalhe;
    onEditClick: () => void;
    onAnamneseClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ paciente, onEditClick, onAnamneseClick }) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate('/pacientes')}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Voltar para Lista
            </button>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center shrink-0">
                        <UserCircle2 className="w-8 h-8 text-primary-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">{paciente.nome}</h1>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                {paciente.idade} anos
                            </span>
                            <span className={`px-2.5 py-1 rounded-md border font-medium
                                ${paciente.sexo.toLowerCase() === 'feminino'
                                    ? 'bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-500/20'
                                    : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'}
                            `}>
                                {paciente.sexo}
                            </span>
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                {paciente.telefones && paciente.telefones.length > 0 ? paciente.telefones[0].numero : 'Não informado'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex w-full md:w-auto gap-3">
                    <button
                        onClick={onEditClick}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl font-medium transition-colors shadow-sm"
                    >
                        <Edit className="w-4 h-4" />
                        Editar Dados
                    </button>
                    <button
                        onClick={onAnamneseClick}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-sm shadow-primary-500/30"
                    >
                        <FileEdit className="w-4 h-4" />
                        Anamnese
                    </button>
                </div>
            </div>
        </div>
    );
};
