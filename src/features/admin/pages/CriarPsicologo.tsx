import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminCriarPsicologo } from '../hooks/useAdminCriarPsicologo';
import {
    ArrowLeft,
    Loader2,
    CheckCircle,
    AlertCircle,
    UserPlus,
    Plus
} from 'lucide-react';
import type { PsicologoCreatePayload } from '../types';
import {
    isValidCPF,
    formatCPF,
    formatRG,
    formatCRP,
    isValidRG,
    isValidCRP,
    isValidEmail
} from '@shared/utils/validators';

export default function CriarPsicologo() {
    const navigate = useNavigate();
    const { criarPsicologo, isSaving, notification, setNotification } = useAdminCriarPsicologo();

    const [formData, setFormData] = useState<PsicologoCreatePayload>({
        nome: '',
        cpf: '',
        rg: '',
        email: '',
        data_nascimento: '',
        sexo: '',
        crp: '',
        especialidade: ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof PsicologoCreatePayload, string>>>({});

    // --- Handlers Básicos ---
    const handleBasicChange = (field: keyof PsicologoCreatePayload, value: string) => {
        let finalValue = value;
        if (field === 'cpf') finalValue = formatCPF(value);
        if (field === 'rg') finalValue = formatRG(value);
        if (field === 'crp') finalValue = formatCRP(value);

        setFormData(prev => ({ ...prev, [field]: finalValue }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validate = () => {
        const newErrors: Partial<Record<keyof PsicologoCreatePayload, string>> = {};

        if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';

        if (!formData.cpf.trim()) {
            newErrors.cpf = 'CPF é obrigatório';
        } else if (!isValidCPF(formData.cpf)) {
            newErrors.cpf = 'CPF inválido';
        }

        if (formData.rg && !isValidRG(formData.rg)) {
            newErrors.rg = 'RG inválido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'E-mail é obrigatório';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'E-mail inválido';
        }

        if (!formData.data_nascimento) {
            newErrors.data_nascimento = 'Data de nascimento é obrigatória';
        }

        if (!formData.crp.trim()) {
            newErrors.crp = 'CRP é obrigatório';
        } else if (!isValidCRP(formData.crp)) {
            newErrors.crp = 'CRP inválido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            setNotification({ visible: true, type: 'error', message: 'Preencha os campos obrigatórios corretamente.' });
            setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 3000);
            return;
        }

        // Limpar máscaras do payload antes de enviar:
        const payloadToSubmit: PsicologoCreatePayload = {
            ...formData,
            cpf: formData.cpf.replace(/\D/g, ''),
            rg: formData.rg.replace(/\D/g, ''),
            crp: formData.crp.replace(/[^0-9a-zA-Z]/g, '')
        };

        const success = await criarPsicologo(payloadToSubmit);

        if (success) {
            setTimeout(() => navigate('/admin/dashboard'), 2000);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <UserPlus className="w-6 h-6 text-primary-500" />
                        Cadastrar Novo Psicólogo
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Insira os dados cadastrais do novo membro da equipe
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Dados Basicos */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden p-6 md:p-8 space-y-6">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3">Dados Pessoais & Profissionais</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nome Completo *</label>
                            <input
                                type="text"
                                value={formData.nome}
                                onChange={(e) => handleBasicChange('nome', e.target.value)}
                                className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border ${errors.nome ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all`}
                                placeholder="Digite o nome completo"
                            />
                            {errors.nome && <p className="text-red-500 text-xs mt-1.5">{errors.nome}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">E-mail *</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleBasicChange('email', e.target.value)}
                                className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all`}
                                placeholder="E-mail de contato e login"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Data de Nascimento *</label>
                            <input
                                type="date"
                                value={formData.data_nascimento}
                                onChange={(e) => handleBasicChange('data_nascimento', e.target.value)}
                                className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border ${errors.data_nascimento ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all`}
                            />
                            {errors.data_nascimento && <p className="text-red-500 text-xs mt-1.5">{errors.data_nascimento}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">CPF *</label>
                            <input
                                type="text"
                                value={formData.cpf}
                                onChange={(e) => handleBasicChange('cpf', e.target.value)}
                                className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border ${errors.cpf ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all`}
                                placeholder="000.000.000-00"
                                maxLength={14}
                            />
                            {errors.cpf && <p className="text-red-500 text-xs mt-1.5">{errors.cpf}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">RG</label>
                            <input
                                type="text"
                                value={formData.rg}
                                onChange={(e) => handleBasicChange('rg', e.target.value)}
                                className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border ${errors.rg ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all`}
                                placeholder="Registro Geral"
                            />
                            {errors.rg && <p className="text-red-500 text-xs mt-1.5">{errors.rg}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Sexo</label>
                            <select
                                value={formData.sexo}
                                onChange={(e) => handleBasicChange('sexo', e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                            >
                                <option value="">Selecione...</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outros">Outro / Prefiro não dizer</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">CRP *</label>
                            <input
                                type="text"
                                value={formData.crp}
                                onChange={(e) => handleBasicChange('crp', e.target.value)}
                                className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border ${errors.crp ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all`}
                                placeholder="00/00000"
                            />
                            {errors.crp && <p className="text-red-500 text-xs mt-1.5">{errors.crp}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Especialidade</label>
                            <input
                                type="text"
                                value={formData.especialidade}
                                onChange={(e) => handleBasicChange('especialidade', e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                placeholder="Ex: Psicanálise"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        disabled={isSaving}
                        className="flex-1 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-semibold transition-all shadow-sm shadow-primary-500/20"
                    >
                        {isSaving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <CheckCircle className="w-5 h-5" />
                        )}
                        Registrar Psicólogo
                    </button>
                </div>
            </form>

            {/* Notifications System */}
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
