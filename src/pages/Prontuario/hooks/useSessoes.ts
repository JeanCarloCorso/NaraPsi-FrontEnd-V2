import { useState, useCallback } from 'react';
import { prontuarioService } from '../services/prontuarioService';
import type { Sessao } from '../types';

export function useSessoes(id: string, showToast: (msg: string, type?: 'success' | 'error') => void) {
    const [sessoes, setSessoes] = useState<Sessao[]>([]);
    const [isLoadingSessoes, setIsLoadingSessoes] = useState(false);
    const [sessoesFetched, setSessoesFetched] = useState(false);

    // Modais e Estados de Operação
    const [sessaoVisualizar, setSessaoVisualizar] = useState<Sessao | null>(null);
    const [sessaoExcluir, setSessaoExcluir] = useState<Sessao | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDownloading, setIsDownloading] = useState<number | null>(null);

    const [showModalSessao, setShowModalSessao] = useState(false);
    const [isSavingSessao, setIsSavingSessao] = useState(false);
    const [sessaoEdicaoId, setSessaoEdicaoId] = useState<number | null>(null);
    const [formSessaoData, setFormSessaoData] = useState('');
    const [formSessaoConteudo, setFormSessaoConteudo] = useState('');

    const [sessaoConcluir, setSessaoConcluir] = useState<Sessao | null>(null);
    const [isFinishingSessao, setIsFinishingSessao] = useState(false);

    const fetchSessoes = useCallback(async () => {
        setIsLoadingSessoes(true);
        try {
            const response = await prontuarioService.getSessoes(id);
            setSessoes(response.data);
            setSessoesFetched(true);
        } catch (err) {
            console.error("Erro ao carregar sessões:", err);
            showToast("Erro ao carregar sessões.", "error");
        } finally {
            setIsLoadingSessoes(false);
        }
    }, [id, showToast]);

    const handleDownload = async (sessao: Sessao) => {
        setIsDownloading(sessao.id_sessao);
        try {
            const response = await prontuarioService.downloadSessao(id, sessao.id_sessao);

            const disposition = response.headers['content-disposition'];
            let filename = `sessao_${sessao.id_sessao}.pdf`;
            if (disposition) {
                const match = disposition.match(/filename[^;=\n]*=((['"](.*?)\3)|([^;\n]*))/i);
                if (match && (match[3] || match[4])) {
                    filename = (match[3] || match[4]).trim();
                }
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Erro ao baixar sessão:', err);
            showToast('Erro ao baixar sessão.', 'error');
        } finally {
            setIsDownloading(null);
        }
    };

    const handleDelete = async () => {
        if (!sessaoExcluir) return;
        setIsDeleting(true);
        try {
            await prontuarioService.deleteSessao(id, sessaoExcluir.id_sessao);
            setSessoes(prev => prev.filter(s => s.id_sessao !== sessaoExcluir.id_sessao));
            setSessaoExcluir(null);
            showToast('Sessão excluída com sucesso!');
        } catch (err) {
            console.error('Erro ao excluir sessão:', err);
            showToast('Não foi possível excluir a sessão.', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleOpenEditModal = (sessao: Sessao) => {
        setSessaoEdicaoId(sessao.id_sessao);
        setFormSessaoData(sessao.data_sessao);
        setFormSessaoConteudo(sessao.conteudo || '');
        setShowModalSessao(true);
    };

    const handleOpenNewModal = () => {
        setSessaoEdicaoId(null);
        setFormSessaoData(new Date().toISOString().split('T')[0]);
        setFormSessaoConteudo('');
        setShowModalSessao(true);
    };

    const handleSaveSessao = async () => {
        if (!formSessaoConteudo.trim()) {
            showToast('Por favor, descreva o relato da sessão.', 'error');
            return;
        }

        setIsSavingSessao(true);
        try {
            const payload = { data_sessao: formSessaoData, conteudo: formSessaoConteudo };

            if (sessaoEdicaoId) {
                const response = await prontuarioService.updateSessao(id, sessaoEdicaoId, payload);
                setSessoes(prev => prev.map(s => s.id_sessao === sessaoEdicaoId ? response.data : s));
                showToast('Sessão atualizada com sucesso!');
            } else {
                const response = await prontuarioService.createSessao(id, payload);
                setSessoes(prev => [response.data, ...prev]);
                showToast('Sessão registrada com sucesso!');
            }

            setShowModalSessao(false);
            setFormSessaoConteudo('');
        } catch (err) {
            console.error('Erro ao salvar sessão:', err);
            showToast('Não foi possível salvar a sessão.', 'error');
        } finally {
            setIsSavingSessao(false);
        }
    };

    const handleFinishSession = async () => {
        if (!sessaoConcluir) return;
        setIsFinishingSessao(true);
        try {
            const response = await prontuarioService.concluirSessao(id, sessaoConcluir.id_sessao);
            setSessoes(prev => prev.map(s => s.id_sessao === sessaoConcluir.id_sessao ? response.data : s));
            setSessaoConcluir(null);
            showToast('Sessão concluída com sucesso!');
        } catch (err) {
            console.error('Erro ao concluir sessão:', err);
            showToast('Não foi possível concluir a sessão.', 'error');
        } finally {
            setIsFinishingSessao(false);
        }
    };

    return {
        sessoes,
        isLoadingSessoes,
        sessoesFetched,
        fetchSessoes,

        // Visualizar
        sessaoVisualizar,
        setSessaoVisualizar,

        // Download
        isDownloading,
        handleDownload,

        // Exclusão
        sessaoExcluir,
        setSessaoExcluir,
        isDeleting,
        handleDelete,

        // Edição/Novo
        showModalSessao,
        setShowModalSessao,
        sessaoEdicaoId,
        isSavingSessao,
        formSessaoData,
        setFormSessaoData,
        formSessaoConteudo,
        setFormSessaoConteudo,
        handleOpenEditModal,
        handleOpenNewModal,
        handleSaveSessao,

        // Conclusão
        sessaoConcluir,
        setSessaoConcluir,
        isFinishingSessao,
        handleFinishSession
    };
}
