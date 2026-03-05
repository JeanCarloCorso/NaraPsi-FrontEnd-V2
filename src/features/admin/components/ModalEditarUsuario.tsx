import { X, CheckCircle, Loader2, ShieldCheck, UserCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { UsuarioAdmin, PerfilResponse, UpdateUsuarioRequest } from '../types';

interface ModalEditarUsuarioProps {
    usuario: UsuarioAdmin | null;
    perfisDisponiveis: PerfilResponse[];
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: number, payload: UpdateUsuarioRequest) => Promise<boolean>;
    isSaving: boolean;
}

export default function ModalEditarUsuario({
    usuario,
    perfisDisponiveis,
    isOpen,
    onClose,
    onSave,
    isSaving
}: ModalEditarUsuarioProps) {

    const [loginAtivo, setLoginAtivo] = useState(false);
    const [perfisSelecionados, setPerfisSelecionados] = useState<number[]>([]);

    useEffect(() => {
        if (usuario && isOpen) {
            setLoginAtivo(usuario.login_ativo);

            // Map the string representation of roles to their IDs based on the available profiles
            const userProfileIds = usuario.perfis
                .map(pName => {
                    const found = perfisDisponiveis.find(p => p.nome === pName);
                    return found ? found.id_perfil : null;
                })
                .filter((id): id is number => id !== null);

            setPerfisSelecionados(userProfileIds);
        }
    }, [usuario, isOpen, perfisDisponiveis]);

    if (!isOpen || !usuario) return null;

    const handleSave = async () => {
        const success = await onSave(usuario.id_usuario, {
            login_ativo: loginAtivo,
            perfis: perfisSelecionados
        });
        if (success) {
            onClose();
        }
    };

    const togglePerfil = (idPerfil: number) => {
        setPerfisSelecionados(prev =>
            prev.includes(idPerfil)
                ? prev.filter(id => id !== idPerfil)
                : [...prev, idPerfil]
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => !isSaving && onClose()}
        >
            <div
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md flex flex-col animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <UserCircle2 className="w-5 h-5 text-primary-500" />
                            Editar Usuário
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {usuario.nome}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Status Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                        <div>
                            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Status da Conta</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Mostrar como ativo ou inativo
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={loginAtivo}
                                onChange={(e) => setLoginAtivo(e.target.checked)}
                                disabled={isSaving}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-600"></div>
                        </label>
                    </div>

                    {/* Perfis Selection */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-slate-400" />
                            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Perfis de Acesso</h4>
                        </div>

                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                            {perfisDisponiveis.map(perfil => (
                                <label
                                    key={perfil.id_perfil}
                                    className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer
                                        ${perfisSelecionados.includes(perfil.id_perfil)
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800'}
                                    `}
                                >
                                    <div className="flex items-center h-5 mt-0.5">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                                            checked={perfisSelecionados.includes(perfil.id_perfil)}
                                            onChange={() => togglePerfil(perfil.id_perfil)}
                                            disabled={isSaving}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-medium ${perfisSelecionados.includes(perfil.id_perfil) ? 'text-primary-700 dark:text-primary-400' : 'text-slate-700 dark:text-slate-200'}`}>
                                            {perfil.nome}
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            {perfil.descricao}
                                        </span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-end gap-3 shrink-0 rounded-b-2xl border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 rounded-xl transition-colors shadow-sm shadow-primary-500/20"
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <CheckCircle className="w-4 h-4" />
                        )}
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
}
