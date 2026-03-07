import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminPerfis } from '../hooks/useAdminPerfis';
import { ShieldCheck, ArrowLeft, Loader2, CheckCircle, AlertCircle, Plus } from 'lucide-react';

export default function CriarPerfil() {
    const navigate = useNavigate();
    const { criarPerfil, isSaving, notification, setNotification } = useAdminPerfis();

    const [formData, setFormData] = useState({
        nome: '',
        descricao: ''
    });

    const [errors, setErrors] = useState({
        nome: '',
        descricao: ''
    });

    const validate = () => {
        let valid = true;
        const newErrors = { nome: '', descricao: '' };

        if (!formData.nome.trim()) {
            newErrors.nome = 'O nome do perfil é obrigatório.';
            valid = false;
        } else if (formData.nome.trim().length < 3) {
            newErrors.nome = 'O nome deve ter pelo menos 3 caracteres.';
            valid = false;
        }

        if (!formData.descricao.trim()) {
            newErrors.descricao = 'A descrição do perfil é obrigatória.';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const success = await criarPerfil(formData);

        if (success) {
            setTimeout(() => {
                navigate('/admin/perfis');
            }, 1500); // Wait a bit to show the success toast before redirecting
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/perfis')}
                    className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-primary-500" />
                        Criar Novo Perfil
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Defina um novo nível de acesso ao sistema
                    </p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Nome do Perfil *
                        </label>
                        <input
                            type="text"
                            value={formData.nome}
                            onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                            className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border ${errors.nome ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all`}
                            placeholder="Ex: Secretária"
                            maxLength={50}
                        />
                        {errors.nome && <p className="text-red-500 text-xs mt-1.5">{errors.nome}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Descrição *
                        </label>
                        <textarea
                            value={formData.descricao}
                            onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                            className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border ${errors.descricao ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all resize-none`}
                            placeholder="Descreva as permissões e objetivo deste perfil..."
                            rows={4}
                            maxLength={255}
                        />
                        {errors.descricao && <p className="text-red-500 text-xs mt-1.5">{errors.descricao}</p>}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/perfis')}
                            disabled={isSaving}
                            className="flex-1 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-semibold transition-all shadow-sm shadow-primary-500/20"
                        >
                            {isSaving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <CheckCircle className="w-5 h-5" />
                            )}
                            Criar Perfil
                        </button>
                    </div>
                </form>
            </div>

            {/* Sistema de Notificação (Toast) */}
            {notification.visible && (
                <div className={`fixed top-6 right-6 z-[100] min-w-[300px] p-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-full duration-300 flex items-center gap-3
                    ${notification.type === 'success'
                        ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-500/20'
                        : 'bg-white dark:bg-slate-900 border-red-200 dark:border-red-500/20'
                    }`}
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                        ${notification.type === 'success'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                        }`}
                    >
                        {notification.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {notification.type === 'success' ? 'Sucesso!' : 'Ocorreu um erro'}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {notification.message}
                        </p>
                    </div>
                    <button
                        onClick={() => setNotification(prev => ({ ...prev, visible: false }))}
                        className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4 rotate-45" />
                    </button>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 h-1 bg-slate-100 dark:bg-slate-800 w-full overflow-hidden rounded-b-2xl">
                        <div className={`h-full animate-toast-progress
                            ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
