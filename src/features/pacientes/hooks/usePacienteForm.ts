import { useState } from 'react';
import { maskCEP, cleanDigits } from '@shared/utils/masks';
import { isValidEmail, isValidCPF, isValidDate, sanitizeText, formatEmail } from '@shared/utils/validators';
import { pacientesService } from '../services/pacientesService';
import type { PacienteFormData, Telefone, Endereco, Familiar } from '../types';

interface NotificationState {
    message: string;
    type: 'success' | 'error';
    visible: boolean;
}

export function usePacienteForm(onSuccess: () => void) {
    const [showModalNovoPaciente, setShowModalNovoPaciente] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const initialFormData: PacienteFormData = {
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

        formData.telefones.forEach((tel, idx) => {
            const clean = cleanDigits(tel.numero);
            if (tel.numero && (clean.length < 10 || clean.length > 11)) {
                newErrors[`telefone_${idx}`] = 'Telefone inválido';
            }
        });

        formData.familiares.forEach((fam, idx) => {
            if (fam.telefone) {
                const cleanFam = cleanDigits(fam.telefone);
                if (cleanFam.length < 10 || cleanFam.length > 11) {
                    newErrors[`familiar_telefone_${idx}`] = 'Telefone inválido';
                }
            }
        });

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

            await pacientesService.criarPaciente(payload);
            showToast('Paciente cadastrado com sucesso!');
            setShowModalNovoPaciente(false);
            setFormData(initialFormData);
            setFieldErrors({});
            onSuccess();
        } catch (err: any) {
            console.error('Erro ao cadastrar paciente:', err);
            showToast(err.response?.data?.message || 'Erro ao cadastrar paciente. Tente novamente.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return {
        formData,
        setFormData,
        fieldErrors,
        isSaving,
        showModalNovoPaciente,
        setShowModalNovoPaciente,
        notification,
        setNotification,
        handleCEPChange,
        addTelefone,
        removeTelefone,
        updateTelefone,
        addEndereco,
        removeEndereco,
        updateEndereco,
        addFamiliar,
        removeFamiliar,
        updateFamiliar,
        handleSavePaciente
    };
}
