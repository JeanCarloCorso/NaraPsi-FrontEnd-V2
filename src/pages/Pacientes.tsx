import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, UserCircle2, Calendar, Activity, Loader2, AlertCircle, CheckCircle, Phone, Paperclip, Trash2, FileEdit } from 'lucide-react';
import api from '../services/api';
import { maskCPF, maskRG, maskCEP, maskPhone, cleanDigits } from '../utils/masks';
import { isValidEmail, isValidCPF, isValidDate, sanitizeText, formatEmail } from '../utils/validators';

interface Paciente {
    id: number;
    nome: string;
    sexo: string;
    idade: number;
    ultima_data_sessao: string | null;
}

interface Telefone {
    numero: string;
    descricao: string;
}

interface Endereco {
    cep: string;
    endereco: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    pais: string;
    descricao: string;
}

interface Familiar {
    nome: string;
    parentesco: string;
    profissao: string;
    telefone: string;
}

interface PacienteFormData {
    nome: string;
    cpf: string;
    rg: string;
    email: string;
    data_nascimento: string;
    sexo: string;
    telefones: Telefone[];
    enderecos: Endereco[];
    familiares: Familiar[];
    anotacoes: string;
}

interface NotificationState {
    message: string;
    type: 'success' | 'error';
    visible: boolean;
}

export default function Pacientes() {
    const navigate = useNavigate();
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal de Novo Paciente
    const [showModalNovoPaciente, setShowModalNovoPaciente] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const initialFormData = {
        nome: '',
        cpf: '',
        rg: '',
        email: '',
        data_nascimento: '',
        sexo: 'Feminino',
        telefones: [{ numero: '', descricao: '' }],
        enderecos: [{
            cep: '', endereco: '', numero: '', complemento: '',
            bairro: '', cidade: '', estado: '', pais: 'Brasil', descricao: ''
        }],
        familiares: [{ nome: '', parentesco: '', profissao: '', telefone: '' }],
        anotacoes: ''
    };

    const [formData, setFormData] = useState<PacienteFormData>(initialFormData);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Usando máscaras centralizadas

    // Busca de CEP
    const handleCEPChange = async (index: number, cep: string) => {
        const maskedCEP = maskCEP(cep);
        updateEndereco(index, 'cep', maskedCEP);

        const cleanCEP = maskedCEP.replace(/\D/g, '');
        if (cleanCEP.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        enderecos: prev.enderecos.map((end, i) => i === index ? {
                            ...end,
                            endereco: data.logradouro || end.endereco,
                            bairro: data.bairro || end.bairro,
                            cidade: data.localidade || end.cidade,
                            estado: data.uf || end.estado
                        } : end)
                    }));
                }
            } catch (err) {
                console.error("Erro ao buscar CEP:", err);
            }
        }
    };

    const [notification, setNotification] = useState<NotificationState>({
        message: '',
        type: 'success',
        visible: false
    });

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type, visible: true });
        setTimeout(() => {
            setNotification(prev => ({ ...prev, visible: false }));
        }, 3000);
    };

    // Funções auxiliares para Listas
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

    const updateTelefone = (index: number, field: keyof Telefone, value: string) => {
        setFormData(prev => ({
            ...prev,
            telefones: prev.telefones.map((tel, i) => i === index ? { ...tel, [field]: value } : tel)
        }));
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

    const updateEndereco = (index: number, field: keyof Endereco, value: string) => {
        setFormData(prev => ({
            ...prev,
            enderecos: prev.enderecos.map((end, i) => i === index ? { ...end, [field]: value } : end)
        }));
    };

    const addFamiliar = () => {
        setFormData(prev => ({
            ...prev,
            familiares: [...prev.familiares, { nome: '', parentesco: '', profissao: '', telefone: '' }]
        }));
    };

    const removeFamiliar = (index: number) => {
        setFormData(prev => ({
            ...prev,
            familiares: prev.familiares.filter((_, i) => i !== index)
        }));
    };

    const updateFamiliar = (index: number, field: keyof Familiar, value: string) => {
        setFormData(prev => ({
            ...prev,
            familiares: prev.familiares.map((fam, i) => i === index ? { ...fam, [field]: value } : fam)
        }));
    };

    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const response = await api.get('/pacientes');
                setPacientes(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Erro ao carregar a lista de pacientes.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPacientes();
    }, []);

    const fetchPacientes = async () => {
        try {
            const response = await api.get('/pacientes');
            setPacientes(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao carregar a lista de pacientes.');
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';

        if (formData.email && !isValidEmail(formData.email)) {
            newErrors.email = 'E-mail inválido';
        }

        if (!formData.cpf) {
            newErrors.cpf = 'CPF é obrigatório';
        } else if (!isValidCPF(formData.cpf)) {
            newErrors.cpf = 'CPF inválido';
        }

        if (!formData.data_nascimento) {
            newErrors.data_nascimento = 'Data de nascimento é obrigatória';
        } else if (!isValidDate(formData.data_nascimento)) {
            newErrors.data_nascimento = 'Data inválida ou futura';
        }

        // Validação de Telefones
        formData.telefones.forEach((tel, idx) => {
            const clean = cleanDigits(tel.numero);
            if (tel.numero && (clean.length < 10 || clean.length > 11)) {
                newErrors[`telefone_${idx}`] = 'Telefone inválido';
            }
        });

        // Validação de Familiares (Telefone)
        formData.familiares.forEach((fam, idx) => {
            if (fam.telefone) {
                const cleanFam = cleanDigits(fam.telefone);
                if (cleanFam.length < 10 || cleanFam.length > 11) {
                    newErrors[`familiar_telefone_${idx}`] = 'Telefone inválido';
                }
            }
        });

        // Validação de CEPs
        formData.enderecos.forEach((end, idx) => {
            if (end.cep && cleanDigits(end.cep).length !== 8) {
                newErrors[`cep_${idx}`] = 'CEP inválido';
            }
        });

        setFieldErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSavePaciente = async () => {
        if (!validateForm()) {
            showToast('Por favor, corrija os erros no formulário.', 'error');
            return;
        }

        setIsSaving(true);
        try {
            // Sanitização do Payload
            const payload = {
                ...formData,
                nome: sanitizeText(formData.nome),
                email: formData.email ? formatEmail(formData.email) : '',
                cpf: cleanDigits(formData.cpf),
                rg: cleanDigits(formData.rg),
                anotacoes: sanitizeText(formData.anotacoes),
                telefones: formData.telefones.map(tel => ({
                    ...tel,
                    numero: cleanDigits(tel.numero),
                    descricao: sanitizeText(tel.descricao)
                })),
                enderecos: formData.enderecos.map(end => ({
                    ...end,
                    endereco: sanitizeText(end.endereco),
                    bairro: sanitizeText(end.bairro),
                    cidade: sanitizeText(end.cidade),
                    complemento: sanitizeText(end.complemento),
                    descricao: sanitizeText(end.descricao),
                    cep: cleanDigits(end.cep)
                })),
                familiares: formData.familiares.map(fam => ({
                    ...fam,
                    nome: sanitizeText(fam.nome),
                    parentesco: sanitizeText(fam.parentesco),
                    profissao: sanitizeText(fam.profissao),
                    telefone: cleanDigits(fam.telefone)
                }))
            };

            await api.post('/pacientes', payload);
            showToast('Paciente cadastrado com sucesso!');
            setShowModalNovoPaciente(false);
            setFormData(initialFormData);
            setFieldErrors({});
            fetchPacientes();
        } catch (err: any) {
            console.error('Erro ao cadastrar paciente:', err);
            showToast(err.response?.data?.message || 'Erro ao cadastrar paciente. Tente novamente.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Memoize the filtered list so we don't recalculate on every render unless deps change
    const filteredPacientes = useMemo(() => {
        // Only apply filter if the search term has 3 or more characters
        if (searchTerm.trim().length >= 3) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            return pacientes.filter(p =>
                p.nome.toLowerCase().includes(lowerCaseSearch) ||
                p.sexo.toLowerCase().includes(lowerCaseSearch)
            );
        }
        return pacientes;
    }, [pacientes, searchTerm]);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return <span className="text-slate-400 dark:text-slate-500 italic">Sem sessões</span>;

        // Handling YYYY-MM-DD backend possible format
        const dateObj = new Date(dateString);
        if (isNaN(dateObj.getTime())) return dateString;

        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(dateObj);
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-500/20 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nome ou sexo (min. 3 letras)..."
                        className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl leading-5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors shadow-sm"
                    />
                </div>

                <button
                    onClick={() => setShowModalNovoPaciente(true)}
                    className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm shadow-primary-500/30 flex items-center justify-center gap-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Novo Paciente
                </button>
            </div>

            {/* Patients List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                {filteredPacientes.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Paciente
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Sexo
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Idade
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Última Sessão
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-transparent divide-y divide-slate-100 dark:divide-slate-800/60">
                                {filteredPacientes.map((paciente) => (
                                    <tr
                                        key={paciente.id}
                                        onClick={() => navigate(`/pacientes/${paciente.id}`)}
                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                    <UserCircle2 className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                                                </div>
                                                <div className="text-sm font-medium text-slate-900 dark:text-slate-200">
                                                    {paciente.nome}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                ${paciente.sexo.toLowerCase() === 'feminino'
                                                    ? 'bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-500/20'
                                                    : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'}
                                            `}>
                                                {paciente.sexo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                            {paciente.idade} anos
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                {formatDate(paciente.ultima_data_sessao)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors px-3 py-1 flex items-center gap-1 ml-auto">
                                                <Activity className="w-4 h-4" />
                                                Prontuário
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
                            {searchTerm.length >= 3 ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                            {searchTerm.length >= 3
                                ? `Não encontramos resultados para "${searchTerm}". Tente uma busca diferente.`
                                : 'Você ainda não possui pacientes. Clique no botão "Novo Paciente" para começar.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Modal de Novo Paciente */}
            {showModalNovoPaciente && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => !isSaving && setShowModalNovoPaciente(false)}
                >
                    <div
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Cadastrar Novo Paciente</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Preencha as informações para criar um novo prontuário</p>
                            </div>
                            <button
                                onClick={() => setShowModalNovoPaciente(false)}
                                disabled={isSaving}
                                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="overflow-y-auto flex-1 p-6 space-y-8 custom-scrollbar">
                            {/* Dados Pessoais */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <UserCircle2 className="w-4 h-4" /> Dados Pessoais
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Nome Completo *</label>
                                        <input
                                            type="text"
                                            value={formData.nome || ''}
                                            onChange={e => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                                            className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border ${fieldErrors.nome ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all`}
                                            placeholder="Nome do paciente"
                                            maxLength={100}
                                        />
                                        {fieldErrors.nome && <p className="text-red-500 text-[10px] mt-1 ml-1">{fieldErrors.nome}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Sexo</label>
                                        <select
                                            value={formData.sexo || 'Masculino'}
                                            onChange={e => setFormData(prev => ({ ...prev, sexo: e.target.value }))}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                        >
                                            <option value="Masculino">Masculino</option>
                                            <option value="Feminino">Feminino</option>
                                            <option value="Outros">Outros</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">CPF *</label>
                                        <input
                                            type="text"
                                            value={formData.cpf || ''}
                                            onChange={e => setFormData(prev => ({ ...prev, cpf: maskCPF(e.target.value) }))}
                                            className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border ${fieldErrors.cpf ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all`}
                                            placeholder="000.000.000-00"
                                            maxLength={14}
                                        />
                                        {fieldErrors.cpf && <p className="text-red-500 text-[10px] mt-1 ml-1">{fieldErrors.cpf}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">RG</label>
                                        <input
                                            type="text"
                                            value={formData.rg || ''}
                                            onChange={e => setFormData(prev => ({ ...prev, rg: maskRG(e.target.value) }))}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                            placeholder="Número do RG"
                                            maxLength={14}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">E-mail</label>
                                        <input
                                            type="email"
                                            value={formData.email || ''}
                                            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border ${fieldErrors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all`}
                                            placeholder="email@exemplo.com"
                                            maxLength={255}
                                        />
                                        {fieldErrors.email && <p className="text-red-500 text-[10px] mt-1 ml-1">{fieldErrors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Data de Nascimento *</label>
                                        <input
                                            type="date"
                                            value={formData.data_nascimento || ''}
                                            onChange={e => setFormData(prev => ({ ...prev, data_nascimento: e.target.value }))}
                                            className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border ${fieldErrors.data_nascimento ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all`}
                                        />
                                        {fieldErrors.data_nascimento && <p className="text-red-500 text-[10px] mt-1 ml-1">{fieldErrors.data_nascimento}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Telefones */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <Phone className="w-4 h-4" /> Telefones
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={addTelefone}
                                        className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> Adicionar Telefone
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {formData.telefones.map((tel, idx) => (
                                        <div key={idx} className="flex gap-3 items-end bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <div className="flex-1">
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Número</label>
                                                <input
                                                    type="text"
                                                    value={tel.numero || ''}
                                                    onChange={e => updateTelefone(idx, 'numero', maskPhone(e.target.value))}
                                                    className={`w-full px-3 py-1.5 bg-white dark:bg-slate-800 border ${fieldErrors[`telefone_${idx}`] ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg outline-none text-slate-900 dark:text-white text-sm`}
                                                    placeholder="(00) 00000-0000"
                                                    maxLength={15}
                                                />
                                                {fieldErrors[`telefone_${idx}`] && <p className="text-red-500 text-[10px] mt-1">{fieldErrors[`telefone_${idx}`]}</p>}
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Descrição</label>
                                                <input
                                                    type="text"
                                                    value={tel.descricao || ''}
                                                    onChange={e => updateTelefone(idx, 'descricao', e.target.value)}
                                                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    placeholder="Ex: Celular, Casa"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeTelefone(idx)}
                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {formData.telefones.length === 0 && (
                                        <p className="text-xs text-slate-400 italic text-center py-2">Nenhum telefone adicionado.</p>
                                    )}
                                </div>
                            </div>

                            {/* Endereços */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <Paperclip className="w-4 h-4" /> Endereços
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={addEndereco}
                                        className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> Adicionar Endereço
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {formData.enderecos.map((end, idx) => (
                                        <div key={idx} className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                                            <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-2 -m-4 mb-3 rounded-t-xl px-4 border-b border-slate-200 dark:border-slate-700">
                                                <span className="text-xs font-bold text-slate-500">Endereço #{idx + 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeEndereco(idx)}
                                                    className="text-xs text-red-500 hover:underline"
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">CEP</label>
                                                    <input
                                                        type="text"
                                                        value={end.cep || ''}
                                                        onChange={e => handleCEPChange(idx, e.target.value)}
                                                        className={`w-full px-3 py-1.5 bg-white dark:bg-slate-800 border ${fieldErrors[`cep_${idx}`] ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg outline-none text-slate-900 dark:text-white text-sm`}
                                                        placeholder="00000-000"
                                                        maxLength={9}
                                                    />
                                                    {fieldErrors[`cep_${idx}`] && <p className="text-red-500 text-[10px] mt-1">{fieldErrors[`cep_${idx}`]}</p>}
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Endereço (Rua/Av)</label>
                                                    <input
                                                        type="text"
                                                        value={end.endereco || ''}
                                                        onChange={e => updateEndereco(idx, 'endereco', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Nº</label>
                                                    <input
                                                        type="text"
                                                        value={end.numero || ''}
                                                        onChange={e => updateEndereco(idx, 'numero', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                        maxLength={10}
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Complemento</label>
                                                    <input
                                                        type="text"
                                                        value={end.complemento || ''}
                                                        onChange={e => updateEndereco(idx, 'complemento', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                        maxLength={100}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Bairro</label>
                                                    <input
                                                        type="text"
                                                        value={end.bairro || ''}
                                                        onChange={e => updateEndereco(idx, 'bairro', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Cidade</label>
                                                    <input
                                                        type="text"
                                                        value={end.cidade || ''}
                                                        onChange={e => updateEndereco(idx, 'cidade', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Estado</label>
                                                    <input
                                                        type="text"
                                                        value={end.estado || ''}
                                                        onChange={e => updateEndereco(idx, 'estado', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">País</label>
                                                    <input
                                                        type="text"
                                                        value={end.pais || ''}
                                                        onChange={e => updateEndereco(idx, 'pais', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                                <div className="md:col-span-4">
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Descrição</label>
                                                    <input
                                                        type="text"
                                                        value={end.descricao || ''}
                                                        onChange={e => updateEndereco(idx, 'descricao', e.target.value)}
                                                        placeholder="Ex: Residencial"
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {formData.enderecos.length === 0 && (
                                        <p className="text-xs text-slate-400 italic text-center py-2">Nenhum endereço adicionado.</p>
                                    )}
                                </div>
                            </div>

                            {/* Familiares */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <UserCircle2 className="w-4 h-4" /> Familiares
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={addFamiliar}
                                        className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> Adicionar Familiar
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {formData.familiares.map((fam, idx) => (
                                        <div key={idx} className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                                            <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-2 -m-4 mb-3 rounded-t-xl px-4 border-b border-slate-200 dark:border-slate-700">
                                                <span className="text-xs font-bold text-slate-500">Familiar #{idx + 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFamiliar(idx)}
                                                    className="text-xs text-red-500 hover:underline"
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                                <div className="lg:col-span-2">
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Nome</label>
                                                    <input
                                                        type="text"
                                                        value={fam.nome || ''}
                                                        onChange={e => updateFamiliar(idx, 'nome', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Parentesco</label>
                                                    <input
                                                        type="text"
                                                        value={fam.parentesco || ''}
                                                        onChange={e => updateFamiliar(idx, 'parentesco', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Telefone</label>
                                                    <input
                                                        type="text"
                                                        value={fam.telefone || ''}
                                                        onChange={e => updateFamiliar(idx, 'telefone', maskPhone(e.target.value))}
                                                        className={`w-full px-3 py-1.5 bg-white dark:bg-slate-800 border ${fieldErrors[`familiar_telefone_${idx}`] ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg outline-none text-slate-900 dark:text-white text-sm`}
                                                        placeholder="(00) 00000-0000"
                                                        maxLength={15}
                                                    />
                                                    {fieldErrors[`familiar_telefone_${idx}`] && <p className="text-red-500 text-[10px] mt-1">{fieldErrors[`familiar_telefone_${idx}`]}</p>}
                                                </div>
                                                <div className="lg:col-span-2">
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Profissão</label>
                                                    <input
                                                        type="text"
                                                        value={fam.profissao || ''}
                                                        onChange={e => updateFamiliar(idx, 'profissao', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {formData.familiares.length === 0 && (
                                        <p className="text-xs text-slate-400 italic text-center py-2">Nenhum familiar adicionado.</p>
                                    )}
                                </div>
                            </div>

                            {/* Anotações */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <FileEdit className="w-4 h-4" /> Anotações Adicionais
                                </h4>
                                <textarea
                                    value={formData.anotacoes || ''}
                                    onChange={e => setFormData(prev => ({ ...prev, anotacoes: e.target.value }))}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all resize-none"
                                    placeholder="Anotações gerais sobre o paciente..."
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 shrink-0">
                            <button
                                onClick={handleSavePaciente}
                                disabled={isSaving}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-semibold transition-all shadow-sm shadow-primary-500/20"
                            >
                                {isSaving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-4 h-4" />
                                )}
                                Salvar Paciente
                            </button>
                            <button
                                onClick={() => setShowModalNovoPaciente(false)}
                                disabled={isSaving}
                                className="flex-1 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
