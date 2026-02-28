import { useEffect, useState } from 'react';
import { UserCircle, Save, Phone, MapPin, Briefcase, Loader2, Plus, Trash2, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import api from '../services/api';
import { maskCPF, maskRG, maskCEP, maskPhone, cleanDigits } from '../utils/masks';
import { isValidEmail, isValidCPF, isValidDate, sanitizeText, formatEmail } from '../utils/validators';

interface ProfileEditPayload {
    nome: string;
    cpf: string;
    rg: string;
    email: string;
    data_nascimento: string;
    sexo: string;
    crp: string;
    especialidade: string;
    telefones: { numero: string; descricao: string }[];
    enderecos: {
        cep: string;
        endereco: string;
        numero: number | string;
        complemento: string;
        bairro: string;
        cidade: string;
        estado: string;
        pais: string;
        descricao: string;
    }[];
}

export default function Profile() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<ProfileEditPayload>({
        nome: '',
        cpf: '',
        rg: '',
        email: '',
        data_nascimento: '',
        sexo: '',
        crp: '',
        especialidade: '',
        telefones: [{ numero: '', descricao: '' }],
        enderecos: [{
            cep: '', endereco: '', numero: '', complemento: '',
            bairro: '', cidade: '', estado: '', pais: 'Brasil', descricao: 'Principal'
        }]
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/psicologo/me');
                const data = response.data;
                const pessoa = data.pessoa || {};
                const psicologo = data.psicologo || {};

                let telefones = data.telefones && data.telefones.length > 0 ? data.telefones : [{ numero: '', descricao: '' }];
                let enderecos = data.enderecos && data.enderecos.length > 0 ? data.enderecos : [{
                    cep: '', endereco: '', numero: '', complemento: '',
                    bairro: '', cidade: '', estado: '', pais: 'Brasil', descricao: ''
                }];

                // Formatar dados vindos da API
                telefones = telefones.map((t: any) => ({ ...t, numero: maskPhone(t.numero) }));
                enderecos = enderecos.map((e: any) => ({ ...e, cep: maskCEP(e.cep) }));

                const birthDate = pessoa.data_nascimento?.split(' ')[0] || '';

                setFormData({
                    nome: pessoa.nome || '',
                    cpf: pessoa.cpf ? maskCPF(pessoa.cpf) : '',
                    rg: pessoa.rg ? maskRG(pessoa.rg) : '',
                    email: pessoa.email || '',
                    data_nascimento: birthDate,
                    sexo: pessoa.sexo || '',
                    crp: psicologo.crp || '',
                    especialidade: psicologo.especialidade || '',
                    telefones,
                    enderecos
                });
            } catch (err: any) {
                setMessage({ type: 'error', text: 'Erro ao carregar os dados do perfil.' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Efeito para limpar o Toast Message após 10s
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 10000); // 10s
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleFieldChange = (field: keyof ProfileEditPayload, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Limpar erro ao digitar
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Telefones
    const handleTelefoneChange = (index: number, field: string, value: string) => {
        const parsedValue = field === 'numero' ? maskPhone(value) : value;
        const newTelefones = [...formData.telefones];
        newTelefones[index] = { ...newTelefones[index], [field]: parsedValue };
        setFormData(prev => ({ ...prev, telefones: newTelefones }));
    };

    const addTelefone = () => {
        setFormData(prev => ({
            ...prev,
            telefones: [...prev.telefones, { numero: '', descricao: '' }]
        }));
    };

    const removeTelefone = (index: number) => {
        setFormData(prev => ({
            ...prev,
            telefones: prev.telefones.filter((_, i) => i !== index)
        }));
    };

    // Endereços
    const handleEnderecoChange = async (index: number, field: string, value: string | number) => {
        const finalValue = field === 'cep' ? maskCEP(value as string) : value;

        setFormData(prev => {
            const newEnderecos = [...prev.enderecos];
            newEnderecos[index] = { ...newEnderecos[index], [field]: finalValue };
            return { ...prev, enderecos: newEnderecos };
        });

        // ViaCEP Autocomplete
        if (field === 'cep') {
            const cleanCep = cleanDigits(value as string);
            if (cleanCep.length === 8) {
                try {
                    const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                    const viaCepData = await viaCepResponse.json();

                    if (!viaCepData.erro) {
                        setFormData(prev => {
                            const newEnds = [...prev.enderecos];
                            newEnds[index] = {
                                ...newEnds[index],
                                endereco: viaCepData.logradouro || newEnds[index].endereco,
                                bairro: viaCepData.bairro || newEnds[index].bairro,
                                cidade: viaCepData.localidade || newEnds[index].cidade,
                                estado: viaCepData.uf || newEnds[index].estado,
                            };
                            return { ...prev, enderecos: newEnds };
                        });
                        setMessage({ type: 'info', text: 'Endereço autocompletado do ViaCEP.' });
                    }
                } catch (err) {
                    console.error('Erro ao buscar CEP', err);
                }
            }
        }
    };

    const addEndereco = () => {
        setFormData(prev => ({
            ...prev,
            enderecos: [...prev.enderecos, {
                cep: '', endereco: '', numero: '', complemento: '',
                bairro: '', cidade: '', estado: '', pais: 'Brasil', descricao: ''
            }]
        }));
    };

    const removeEndereco = (index: number) => {
        setFormData(prev => ({
            ...prev,
            enderecos: prev.enderecos.filter((_, i) => i !== index)
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';

        if (formData.email && !isValidEmail(formData.email)) {
            newErrors.email = 'E-mail inválido';
        } else if (!formData.email) {
            newErrors.email = 'E-mail é obrigatório';
        }

        if (formData.cpf && !isValidCPF(formData.cpf)) {
            newErrors.cpf = 'CPF inválido';
        }

        if (!formData.data_nascimento) {
            newErrors.data_nascimento = 'Data de nascimento é obrigatória';
        } else if (!isValidDate(formData.data_nascimento)) {
            newErrors.data_nascimento = 'Data inválida ou futura';
        }

        // Validar telefones
        formData.telefones.forEach((tel, idx) => {
            const cleanTel = cleanDigits(tel.numero);
            if (tel.numero && (cleanTel.length < 10 || cleanTel.length > 11)) {
                newErrors[`telefone_${idx}`] = 'Telefone incompleto';
            }
        });

        // Validar endereços
        formData.enderecos.forEach((end, idx) => {
            if (end.cep && cleanDigits(end.cep).length !== 8) {
                newErrors[`cep_${idx}`] = 'CEP incompleto';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            setMessage({ type: 'error', text: 'Por favor, corrija os erros no formulário.' });
            return;
        }

        setIsSaving(true);
        setMessage(null);

        try {
            // Preparar o payload com sanitização
            const payload = {
                ...formData,
                nome: sanitizeText(formData.nome),
                email: formatEmail(formData.email),
                cpf: cleanDigits(formData.cpf),
                rg: cleanDigits(formData.rg),
                crp: sanitizeText(formData.crp),
                especialidade: sanitizeText(formData.especialidade),
                enderecos: formData.enderecos.map(end => ({
                    ...end,
                    endereco: sanitizeText(end.endereco),
                    bairro: sanitizeText(end.bairro),
                    cidade: sanitizeText(end.cidade),
                    complemento: sanitizeText(end.complemento),
                    descricao: sanitizeText(end.descricao),
                    numero: Number(end.numero) || 0,
                    cep: cleanDigits(end.cep)
                })),
                telefones: formData.telefones.map(tel => ({
                    ...tel,
                    numero: cleanDigits(tel.numero),
                    descricao: sanitizeText(tel.descricao)
                }))
            };

            await api.put('/psicologo/me/editar', payload);
            setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });

            if (formData.nome) localStorage.setItem('nome', formData.nome);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Erro ao salvar perfil.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 relative">

            {/* Super Toast Message 10s */}
            {message && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-xl shadow-xl transition-all duration-300 animate-in slide-in-from-right bg-white dark:bg-slate-800 border-l-4 min-w-[300px]
                    ${message.type === 'success' ? 'border-green-500' : message.type === 'error' ? 'border-red-500' : 'border-blue-500'}`}>

                    {message.type === 'success' && <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />}
                    {message.type === 'error' && <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />}
                    {message.type === 'info' && <Info className="w-6 h-6 text-blue-500 shrink-0" />}

                    <p className="font-medium text-slate-800 dark:text-slate-200 text-sm leading-tight pr-6">
                        {message.text}
                    </p>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                        <UserCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Editar Perfil</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Gerencie suas informações pessoais, profissionais, contato e localizações.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Dados Pessoais */}
                    <section>
                        <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Dados Pessoais</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome Completo</label>
                                <input type="text" value={formData.nome} onChange={(e) => handleFieldChange('nome', e.target.value)} required
                                    className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border ${errors.nome ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200 transition-all`} />
                                {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mail</label>
                                <input type="email" value={formData.email} onChange={(e) => handleFieldChange('email', e.target.value)} required
                                    className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200 transition-all`} />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CPF</label>
                                <input type="text" value={formData.cpf} onChange={(e) => handleFieldChange('cpf', maskCPF(e.target.value))} maxLength={14}
                                    className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border ${errors.cpf ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200 transition-all`} placeholder="000.000.000-00" />
                                {errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">RG</label>
                                <input type="text" value={formData.rg} onChange={(e) => handleFieldChange('rg', maskRG(e.target.value))} maxLength={14} placeholder="RG ou CPF"
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Data Nascimento *</label>
                                <input type="date" value={formData.data_nascimento} onChange={(e) => handleFieldChange('data_nascimento', e.target.value)}
                                    className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border ${errors.data_nascimento ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200 [&::-webkit-calendar-picker-indicator]:dark:invert transition-all`} />
                                {errors.data_nascimento && <p className="text-red-500 text-xs mt-1">{errors.data_nascimento}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sexo</label>
                                <select value={formData.sexo} onChange={(e) => handleFieldChange('sexo', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200">
                                    <option value="Masculino">Masculino</option>
                                    <option value="Feminino">Feminino</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Dados Profissionais */}
                    <section>
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <Briefcase className="w-5 h-5 text-slate-400" />
                            <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200">Profissional</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CRP</label>
                                <input type="text" value={formData.crp} onChange={(e) => handleFieldChange('crp', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Especialidade</label>
                                <input type="text" value={formData.especialidade} onChange={(e) => handleFieldChange('especialidade', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                            </div>
                        </div>
                    </section>

                    {/* Contato (Dinâmico) */}
                    <section>
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Phone className="w-5 h-5 text-slate-400" />
                                <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200">Contatos Telefônicos</h2>
                            </div>
                            <button type="button" onClick={addTelefone} className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1">
                                <Plus className="w-4 h-4" /> Adicionar
                            </button>
                        </div>
                        <div className="space-y-4">
                            {formData.telefones.map((telefone, index) => (
                                <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end p-4 rounded-xl border border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20">
                                    <div className="sm:col-span-5">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Número</label>
                                        <input type="text" value={telefone.numero} onChange={(e) => handleTelefoneChange(index, 'numero', e.target.value)} placeholder="(00) 00000-0000" maxLength={15}
                                            className={`w-full px-3 py-2 bg-white dark:bg-slate-900 border ${errors[`telefone_${index}`] ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200 transition-all`} />
                                        {errors[`telefone_${index}`] && <p className="text-red-500 text-xs mt-1">{errors[`telefone_${index}`]}</p>}
                                    </div>
                                    <div className="sm:col-span-6">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descrição</label>
                                        <input type="text" value={telefone.descricao} onChange={(e) => handleTelefoneChange(index, 'descricao', e.target.value)} placeholder="Ex: Consultório, Pessoal..."
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                                    </div>
                                    <div className="sm:col-span-1 flex justify-end">
                                        <button type="button" onClick={() => removeTelefone(index)} disabled={formData.telefones.length === 1}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Endereços (Dinâmicos com viaCEP) */}
                    <section>
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-slate-400" />
                                <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200">Endereços de Atendimento</h2>
                            </div>
                            <button type="button" onClick={addEndereco} className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1">
                                <Plus className="w-4 h-4" /> Adicionar
                            </button>
                        </div>
                        <div className="space-y-6">
                            {formData.enderecos.map((endereco, index) => (
                                <div key={index} className="p-5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-800/10 space-y-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">{endereco.descricao || `Endereço ${index + 1}`}</h3>
                                        <button type="button" onClick={() => removeEndereco(index)} disabled={formData.enderecos.length === 1}
                                            className="p-1 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm transition-colors disabled:opacity-30">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                                        <div className="col-span-6 sm:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CEP</label>
                                            <input type="text" value={endereco.cep} onChange={(e) => handleEnderecoChange(index, 'cep', e.target.value)} maxLength={9} placeholder="00000-000"
                                                className={`w-full px-3 py-2 bg-white dark:bg-slate-900 border ${errors[`cep_${index}`] ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200 transition-all`} />
                                            {errors[`cep_${index}`] && <p className="text-red-500 text-xs mt-1">{errors[`cep_${index}`]}</p>}
                                        </div>
                                        <div className="col-span-6 sm:col-span-4">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rua / Logradouro</label>
                                            <input type="text" value={endereco.endereco} onChange={(e) => handleEnderecoChange(index, 'endereco', e.target.value)} placeholder="Av. Paulista..."
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                                        </div>
                                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Número</label>
                                            <input type="text" value={endereco.numero} onChange={(e) => handleEnderecoChange(index, 'numero', cleanDigits(e.target.value))} placeholder="123"
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                                        </div>
                                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Complemento</label>
                                            <input type="text" value={endereco.complemento} onChange={(e) => handleEnderecoChange(index, 'complemento', e.target.value)} placeholder="Apto 101"
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                                        </div>
                                        <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bairro</label>
                                            <input type="text" value={endereco.bairro} onChange={(e) => handleEnderecoChange(index, 'bairro', e.target.value)}
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                                        </div>
                                        <div className="col-span-6 sm:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cidade</label>
                                            <input type="text" value={endereco.cidade} onChange={(e) => handleEnderecoChange(index, 'cidade', e.target.value)}
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                                        </div>
                                        <div className="col-span-6 sm:col-span-1">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">UF</label>
                                            <input type="text" value={endereco.estado} onChange={(e) => handleEnderecoChange(index, 'estado', e.target.value.toUpperCase())} maxLength={2} placeholder="SP"
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                                        </div>
                                        <div className="col-span-6 sm:col-span-1">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">País</label>
                                            <input type="text" value={endereco.pais} onChange={(e) => handleEnderecoChange(index, 'pais', e.target.value)} placeholder="Brasil"
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                                        </div>
                                        <div className="col-span-6 sm:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Apelido (ex: Clínica)</label>
                                            <input type="text" value={endereco.descricao} onChange={(e) => handleEnderecoChange(index, 'descricao', e.target.value)} placeholder="Matriz"
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm shadow-primary-500/30 flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
