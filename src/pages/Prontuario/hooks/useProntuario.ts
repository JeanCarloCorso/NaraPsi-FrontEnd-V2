import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { prontuarioService } from '../services/prontuarioService';
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
            cpf: paciente.pessoa?.cpf || '',
            rg: paciente.pessoa?.rg || '',
            email: paciente.pessoa?.email || '',
            data_nascimento: dateFormatted,
            sexo: paciente.sexo,
            anotacoes: paciente.anotacoes || '',
            telefones: paciente.telefones || [],
            enderecos: paciente.enderecos || [],
            familiares: paciente.familiares || []
        });
        setShowModalPedidoEdicao(true);
    };

    const handleUpdatePaciente = async () => {
        if (!paciente) return;
        setIsSavingPaciente(true);
        try {
            await prontuarioService.updatePaciente(id, formDataPaciente);
            await fetchPaciente();
            setShowModalPedidoEdicao(false);
            showToast('Dados do paciente atualizados com sucesso!', 'success');
        } catch (err) {
            console.error('Erro ao atualizar paciente:', err);
            showToast('Erro ao atualizar dados do paciente. Tente novamente.', 'error');
        } finally {
            setIsSavingPaciente(false);
        }
    };

    const handleUpdateField = (field: keyof PacienteFormData, value: any) => {
        setFormDataPaciente(prev => ({ ...prev, [field]: value }));
    };

    const handleUpdateArrayField = (field: 'telefones' | 'enderecos' | 'familiares', index: number, subField: string, value: any) => {
        setFormDataPaciente(prev => {
            const newArray = [...(prev[field] as any[])];
            newArray[index] = { ...newArray[index], [subField]: value };
            return { ...prev, [field]: newArray };
        });
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
        handleRemoveArrayItem
    };
}
