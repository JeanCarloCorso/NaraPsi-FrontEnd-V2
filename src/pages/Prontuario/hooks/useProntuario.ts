import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { prontuarioService } from '../services/prontuarioService';
import { cleanDigits, maskCPF, maskRG, maskPhone, maskCEP } from '../../../utils/masks';
import { isValidEmail, isValidCPF, isValidDate, sanitizeText, formatEmail } from '../../../utils/validators';
import type { PacienteDetalhe, PacienteFormData, NotificationState } from '../types';

export function useProntuario() {
    const { id = '' } = useParams<{ id: string }>();
    const [paciente, setPaciente] = useState<PacienteDetalhe | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Notificações
    const [notification, setNotification] = useState<NotificationState>({
        message: '',
        type: 'success',
        visible: false
    });

    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type, visible: true });
        setTimeout(() => {
            setNotification(prev => ({ ...prev, visible: false }));
        }, 3000);
    }, []);

    // Edição de Paciente
    const [showModalPedidoEdicao, setShowModalPedidoEdicao] = useState(false);
    const [isSavingPaciente, setIsSavingPaciente] = useState(false);
    const [formDataPaciente, setFormDataPaciente] = useState<PacienteFormData>({
        nome: '',
        cpf: '',
        rg: '',
        email: '',
        data_nascimento: '',
        sexo: '',
        anotacoes: '',
        telefones: [],
        enderecos: [],
        familiares: []
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const fetchPaciente = useCallback(async () => {
        try {
            const response = await prontuarioService.getPaciente(id);
            setPaciente(response.data);
        } catch (err: any) {
            console.error('Erro ao buscar paciente:', err);
            setError(err.response?.data?.message || 'Erro ao carregar os dados do paciente.');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchPaciente();
    }, [id, fetchPaciente]);

    const handleOpenEditPaciente = () => {
        if (!paciente) return;

        // Flatten nested person data for the form
        const dateRaw = paciente.pessoa?.data_nascimento || paciente.data_nascimento || '';
        const dateFormatted = dateRaw.split(' ')[0];

        setFormDataPaciente({
            nome: paciente.nome,
            cpf: paciente.pessoa?.cpf ? maskCPF(paciente.pessoa.cpf) : '',
            rg: paciente.pessoa?.rg ? maskRG(paciente.pessoa.rg) : '',
            email: paciente.pessoa?.email || '',
            data_nascimento: dateFormatted,
            sexo: paciente.sexo,
            anotacoes: paciente.anotacoes || '',
            telefones: (paciente.telefones || []).map(tel => ({
                ...tel,
                numero: maskPhone(tel.numero)
            })),
            enderecos: (paciente.enderecos || []).map(end => ({
                ...end,
                cep: maskCEP(end.cep)
            })),
            familiares: (paciente.familiares || []).map(fam => ({
                ...fam,
                telefone: maskPhone(fam.telefone)
            }))
        });
        setFieldErrors({});
        setShowModalPedidoEdicao(true);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formDataPaciente.nome.trim()) newErrors.nome = 'Nome é obrigatório';

        if (formDataPaciente.email && !isValidEmail(formDataPaciente.email)) {
            newErrors.email = 'E-mail inválido';
        }

        if (!formDataPaciente.cpf) {
            newErrors.cpf = 'CPF é obrigatório';
        } else if (!isValidCPF(formDataPaciente.cpf)) {
            newErrors.cpf = 'CPF inválido';
        }

        if (!formDataPaciente.data_nascimento) {
            newErrors.data_nascimento = 'Data de nascimento é obrigatória';
        } else if (!isValidDate(formDataPaciente.data_nascimento)) {
            newErrors.data_nascimento = 'Data inválida ou futura';
        }

        // Validação de Telefones
        (formDataPaciente.telefones || []).forEach((tel, idx) => {
            const clean = cleanDigits(tel.numero);
            if (tel.numero && (clean.length < 10 || clean.length > 11)) {
                newErrors[`telefone_${idx}`] = 'Telefone inválido';
            }
        });

        // Validação de Familiares (Telefone)
        (formDataPaciente.familiares || []).forEach((fam, idx) => {
            if (fam.telefone) {
                const cleanFam = cleanDigits(fam.telefone);
                if (cleanFam.length < 10 || cleanFam.length > 11) {
                    newErrors[`familiar_telefone_${idx}`] = 'Telefone inválido';
                }
            }
        });

        // Validação de CEPs
        (formDataPaciente.enderecos || []).forEach((end, idx) => {
            if (end.cep && cleanDigits(end.cep).length !== 8) {
                newErrors[`cep_${idx}`] = 'CEP inválido';
            }
        });

        setFieldErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdatePaciente = async () => {
        if (!paciente) return;

        if (!validateForm()) {
            showToast('Por favor, corrija os erros no formulário.', 'error');
            return;
        }

        setIsSavingPaciente(true);
        try {
            // Sanitização
            const payload = {
                ...formDataPaciente,
                nome: sanitizeText(formDataPaciente.nome),
                email: formDataPaciente.email ? formatEmail(formDataPaciente.email) : '',
                cpf: cleanDigits(formDataPaciente.cpf),
                rg: cleanDigits(formDataPaciente.rg),
                anotacoes: sanitizeText(formDataPaciente.anotacoes),
                telefones: (formDataPaciente.telefones || []).map(tel => ({
                    ...tel,
                    numero: cleanDigits(tel.numero),
                    descricao: sanitizeText(tel.descricao)
                })),
                enderecos: (formDataPaciente.enderecos || []).map(end => ({
                    ...end,
                    endereco: sanitizeText(end.endereco),
                    bairro: sanitizeText(end.bairro),
                    cidade: sanitizeText(end.cidade),
                    complemento: sanitizeText(end.complemento),
                    descricao: sanitizeText(end.descricao),
                    cep: cleanDigits(end.cep)
                })),
                familiares: (formDataPaciente.familiares || []).map(fam => ({
                    ...fam,
                    nome: sanitizeText(fam.nome),
                    parentesco: sanitizeText(fam.parentesco),
                    profissao: sanitizeText(fam.profissao),
                    telefone: cleanDigits(fam.telefone)
                }))
            };

            await prontuarioService.updatePaciente(id, payload);
            await fetchPaciente();
            setShowModalPedidoEdicao(false);
            setFieldErrors({});
            showToast('Dados do paciente atualizados com sucesso!', 'success');
        } catch (err) {
            console.error('Erro ao atualizar paciente:', err);
            showToast('Erro ao atualizar dados do paciente. Tente novamente.', 'error');
        } finally {
            setIsSavingPaciente(false);
        }
    };

    const handleUpdateField = (field: keyof PacienteFormData, value: any) => {
        let processedValue = value;
        if (field === 'cpf') processedValue = maskCPF(value);
        if (field === 'rg') processedValue = maskRG(value);

        setFormDataPaciente(prev => ({ ...prev, [field]: processedValue }));
        if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleUpdateArrayField = (field: 'telefones' | 'enderecos' | 'familiares', index: number, subField: string, value: any) => {
        let processedValue = value;
        if (subField === 'numero' && field === 'telefones') processedValue = maskPhone(value);
        if (subField === 'cep' && field === 'enderecos') processedValue = maskCEP(value);
        if (subField === 'telefone' && field === 'familiares') processedValue = maskPhone(value);

        setFormDataPaciente(prev => {
            const newArray = [...(prev[field] as any[])];
            newArray[index] = { ...newArray[index], [subField]: processedValue };
            return { ...prev, [field]: newArray };
        });

        const errorKey = `${field.slice(0, -1)}_${index}`;
        if (fieldErrors[errorKey]) setFieldErrors(prev => ({ ...prev, [errorKey]: '' }));
    };

    const handleAddArrayItem = (field: 'telefones' | 'enderecos' | 'familiares') => {
        setFormDataPaciente(prev => {
            const newItem = field === 'telefones' ? { numero: '', descricao: '' } :
                field === 'enderecos' ? { cep: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', pais: 'Brasil', descricao: '' } :
                    { nome: '', parentesco: '', profissao: '', telefone: '' };
            return { ...prev, [field]: [...(prev[field] as any[]), newItem] };
        });
    };

    const handleRemoveArrayItem = (field: 'telefones' | 'enderecos' | 'familiares', index: number) => {
        setFormDataPaciente(prev => ({
            ...prev,
            [field]: (prev[field] as any[]).filter((_, i) => i !== index)
        }));
    };

    return {
        id,
        paciente,
        isLoading,
        error,
        notification,
        showToast,
        fetchPaciente,

        // Modal Edição
        showModalPedidoEdicao,
        setShowModalPedidoEdicao,
        isSavingPaciente,
        formDataPaciente,
        handleOpenEditPaciente,
        handleUpdatePaciente,
        handleUpdateField,
        handleUpdateArrayField,
        handleAddArrayItem,
        handleRemoveArrayItem,
        fieldErrors
    };
}
