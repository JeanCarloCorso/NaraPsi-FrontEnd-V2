import { useState, useCallback } from 'react';
import { prontuarioService } from '../services/prontuarioService';
import { sanitizeText } from '../../../utils/validators';
import type { Anamnese } from '../types';

export function useAnamnese(id: string, showToast: (msg: string, type?: 'success' | 'error') => void) {
    const [anamneseData, setAnamneseData] = useState<Anamnese | null>(null);
    const [isLoadingAnamnese, setIsLoadingAnamnese] = useState(false);
    const [isSavingAnamnese, setIsSavingAnamnese] = useState(false);
    const [showModalAnamnese, setShowModalAnamnese] = useState(false);

    const handleOpenAnamnese = useCallback(async () => {
        setIsLoadingAnamnese(true);
        setShowModalAnamnese(true);
        try {
            const response = await prontuarioService.getAnamnese(id);
            if (response.data && response.data.id_anamneses) {
                setAnamneseData(response.data);
            } else {
                setAnamneseData({
                    id_paciente: Number(id),
                    estrutura_familiar: '',
                    profissao: '',
                    religiao: '',
                    escolaridade: '',
                    qualidade_sono: '',
                    medicamentos: '',
                    historico_familiar: '',
                    trauma_relevante: '',
                    hobbies: '',
                    queixa_principal: '',
                    evolucao_queixa: '',
                    historia_pregressa: '',
                    anotacoes_gerais: ''
                });
            }
        } catch (err) {
            console.error('Erro ao buscar anamnese:', err);
            showToast("Erro ao carregar anamnese.", "error");
        } finally {
            setIsLoadingAnamnese(false);
        }
    }, [id, showToast]);

    const handleSaveAnamnese = async () => {
        if (!anamneseData) return;
        setIsSavingAnamnese(true);
        try {
            // Sanitização em massa de todos os campos de texto
            const payload: Anamnese = {
                ...anamneseData,
                profissao: sanitizeText(anamneseData.profissao),
                religiao: sanitizeText(anamneseData.religiao),
                escolaridade: sanitizeText(anamneseData.escolaridade),
                hobbies: sanitizeText(anamneseData.hobbies),
                queixa_principal: sanitizeText(anamneseData.queixa_principal),
                evolucao_queixa: sanitizeText(anamneseData.evolucao_queixa),
                estrutura_familiar: sanitizeText(anamneseData.estrutura_familiar),
                qualidade_sono: sanitizeText(anamneseData.qualidade_sono),
                medicamentos: sanitizeText(anamneseData.medicamentos),
                historico_familiar: sanitizeText(anamneseData.historico_familiar),
                trauma_relevante: sanitizeText(anamneseData.trauma_relevante),
                historia_pregressa: sanitizeText(anamneseData.historia_pregressa),
                anotacoes_gerais: sanitizeText(anamneseData.anotacoes_gerais)
            };

            await prontuarioService.saveAnamnese(id, payload);
            showToast('Anamnese salva com sucesso!');
            setShowModalAnamnese(false);
        } catch (err) {
            console.error('Erro ao salvar anamnese:', err);
            showToast('Erro ao salvar anamnese.', 'error');
        } finally {
            setIsSavingAnamnese(false);
        }
    };

    const handleUpdateAnamneseField = (field: keyof Anamnese, value: any) => {
        setAnamneseData(prev => prev ? { ...prev, [field]: value } : null);
    };

    return {
        anamneseData,
        isLoadingAnamnese,
        isSavingAnamnese,
        showModalAnamnese,
        setShowModalAnamnese,
        handleOpenAnamnese,
        handleSaveAnamnese,
        handleUpdateAnamneseField
    };
}
