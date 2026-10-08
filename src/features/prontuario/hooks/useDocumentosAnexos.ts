import { useState, useCallback } from 'react';
import { prontuarioService } from '@features/prontuario/services/prontuarioService';
import { sanitizeText } from '@shared/utils/validators';
import type { Documento, DocumentoApiError, Anexo, TipoDocumento, VariavelDocumento } from '@features/prontuario/types';

const isDocumentoApiError = (value: Documento | DocumentoApiError): value is DocumentoApiError => 'erro' in value;

export function useDocumentosAnexos(id: string, showToast: (msg: string, type?: 'success' | 'error') => void) {
    // Documentos
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [isLoadingDocumentos, setIsLoadingDocumentos] = useState(false);
    const [documentosFetched, setDocumentosFetched] = useState(false);
    const [isDownloadingDoc, setIsDownloadingDoc] = useState<number | null>(null);
    const [docVisualizar, setDocVisualizar] = useState<Documento | null>(null);
    const [showModalGerarDocumento, setShowModalGerarDocumento] = useState(false);
    const [tiposDocumentos, setTiposDocumentos] = useState<TipoDocumento[]>([]);
    const [tipoDocumentoSelecionado, setTipoDocumentoSelecionado] = useState<number | null>(null);
    const [variaveisDocumento, setVariaveisDocumento] = useState<VariavelDocumento[]>([]);
    const [valoresDocumento, setValoresDocumento] = useState<Record<string, string>>({});
    const [documentoError, setDocumentoError] = useState('');
    const [isLoadingTipos, setIsLoadingTipos] = useState(false);
    const [isLoadingVariaveis, setIsLoadingVariaveis] = useState(false);
    const [isGeneratingDocumento, setIsGeneratingDocumento] = useState(false);
    const [previewDocumento, setPreviewDocumento] = useState('');
    const [previewDocumentoToken, setPreviewDocumentoToken] = useState('');
    const [isEditingDocumento, setIsEditingDocumento] = useState(false);
    const [conteudoDocumento, setConteudoDocumento] = useState('');
    const [isSavingDocumento, setIsSavingDocumento] = useState(false);
    const [isSigningDocumento, setIsSigningDocumento] = useState(false);
    const [isFinalizingDocumento, setIsFinalizingDocumento] = useState(false);

    // Anexos
    const [anexos, setAnexos] = useState<Anexo[]>([]);
    const [isLoadingAnexos, setIsLoadingAnexos] = useState(false);
    const [anexosFetched, setAnexosFetched] = useState(false);
    const [isDownloadingAnexo, setIsDownloadingAnexo] = useState<number | null>(null);
    const [isDeletingAnexo, setIsDeletingAnexo] = useState<number | null>(null);

    // Upload
    const [showModalUploadAnexo, setShowModalUploadAnexo] = useState(false);
    const [isUploadingAnexo, setIsUploadingAnexo] = useState(false);
    const [uploadAnexoFile, setUploadAnexoFile] = useState<File | null>(null);
    const [uploadAnexoDescricao, setUploadAnexoDescricao] = useState('');

    const fetchDocumentos = useCallback(async () => {
        setIsLoadingDocumentos(true);
        try {
            const response = await prontuarioService.getDocumentos(id);
            setDocumentos(response.data);
            setDocumentosFetched(true);
        } catch (err) {
            console.error("Erro ao carregar documentos:", err);
            showToast("Erro ao carregar documentos.", "error");
        } finally {
            setIsLoadingDocumentos(false);
        }
    }, [id, showToast]);

    const fetchAnexos = useCallback(async () => {
        setIsLoadingAnexos(true);
        try {
            const response = await prontuarioService.getAnexos(id);
            setAnexos(response.data);
            setAnexosFetched(true);
        } catch (err) {
            console.error("Erro ao carregar anexos:", err);
            showToast("Erro ao carregar anexos.", "error");
        } finally {
            setIsLoadingAnexos(false);
        }
    }, [id, showToast]);

    const handleDownloadDocumento = async (doc: Documento) => {
        setIsDownloadingDoc(doc.id_documento);
        try {
            const response = await prontuarioService.downloadDocumento(doc.id_documento);
            let fileName = doc.nome || `documento-${doc.id_documento}.pdf`;
            const contentDisposition = response.headers['content-disposition'];
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
                if (fileNameMatch && fileNameMatch[1]) fileName = fileNameMatch[1];
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Erro ao baixar documento:', err);
            showToast('Erro ao baixar o documento.', 'error');
        } finally {
            setIsDownloadingDoc(null);
        }
    };

    const handleOpenGerarDocumento = async () => {
        setShowModalGerarDocumento(true);
        setDocumentoError('');
        setTipoDocumentoSelecionado(null);
        setVariaveisDocumento([]);
        setValoresDocumento({});
        setPreviewDocumento('');
        setPreviewDocumentoToken('');
        if (tiposDocumentos.length > 0) return;

        setIsLoadingTipos(true);
        try {
            const response = await prontuarioService.getTiposDocumentos();
            setTiposDocumentos(response.data);
        } catch (err) {
            console.error('Erro ao carregar tipos de documento:', err);
            setDocumentoError('Não foi possível carregar os tipos de documento.');
        } finally {
            setIsLoadingTipos(false);
        }
    };

    const handleSelectTipoDocumento = async (tipoId: number) => {
        setTipoDocumentoSelecionado(tipoId || null);
        setVariaveisDocumento([]);
        setValoresDocumento({});
        setPreviewDocumento('');
        setPreviewDocumentoToken('');
        setDocumentoError('');
        if (!tipoId) return;

        setIsLoadingVariaveis(true);
        try {
            const response = await prontuarioService.getVariaveisDocumento(tipoId);
            setVariaveisDocumento(response.data);
            setValoresDocumento(Object.fromEntries(response.data.map((variavel) => [variavel.nome_variavel, ''])));
        } catch (err: any) {
            console.error('Erro ao carregar variáveis do documento:', err);
            setDocumentoError(err.response?.data?.detail || 'Este tipo de documento ainda não possui um modelo configurado.');
        } finally {
            setIsLoadingVariaveis(false);
        }
    };

    const validateDocumentoFields = () => {
        const missing = variaveisDocumento.find((variavel) => variavel.obrigatorio && !valoresDocumento[variavel.nome_variavel]?.trim());
        if (missing) {
            setDocumentoError(`Preencha o campo: ${missing.texto_exibido_usuario || missing.nome_variavel}.`);
            return false;
        }
        return true;
    };

    const handlePreviewDocumento = async () => {
        if (!tipoDocumentoSelecionado) return;
        if (!validateDocumentoFields()) return;

        setIsGeneratingDocumento(true);
        setDocumentoError('');
        try {
            const payload = Object.fromEntries(Object.entries(valoresDocumento).map(([key, value]) => [key, sanitizeText(value)]));
            const response = await prontuarioService.previewDocumento(id, tipoDocumentoSelecionado, payload);
            setPreviewDocumento(response.data.conteudo);
            setPreviewDocumentoToken(response.data.preview_token);
        } catch (err: any) {
            console.error('Erro ao gerar prévia:', err);
            const detail = err.response?.data?.detail;
            setDocumentoError(typeof detail === 'string' ? detail : detail?.mensagem || 'Não foi possível gerar a prévia.');
        } finally {
            setIsGeneratingDocumento(false);
        }
    };

    const handleGenerateDocumento = async () => {
        if (!tipoDocumentoSelecionado || !previewDocumento || !previewDocumentoToken) return;
        setIsGeneratingDocumento(true);
        setDocumentoError('');
        try {
            const response = await prontuarioService.criarRascunhoDocumento(id, previewDocumentoToken);

            const documento: Documento = response.data;
            setDocumentos((current) => [documento, ...current]);
            setDocVisualizar(documento);
            setConteudoDocumento(documento.conteudo);
            setShowModalGerarDocumento(false);
            setDocumentosFetched(true);
            setPreviewDocumento('');
            setPreviewDocumentoToken('');
            showToast('Rascunho criado. Revise e finalize quando estiver pronto.');
        } catch (err: any) {
            console.error('Erro ao gerar documento:', err);
            setDocumentoError(err.response?.data?.detail || err.message || 'Não foi possível gerar o documento.');
        } finally {
            setIsGeneratingDocumento(false);
        }
    };

    const handleFinalizarDocumento = async () => {
        if (!docVisualizar || docVisualizar.status !== 'RASCUNHO') return;
        setIsFinalizingDocumento(true);
        try {
            const response = await prontuarioService.finalizarDocumento(id, docVisualizar.id_documento);
            const updated: Documento = { ...docVisualizar, ...response.data };
            setDocumentos((current) => current.map((doc) => doc.id_documento === updated.id_documento ? updated : doc));
            setDocVisualizar(updated);
            showToast('Documento finalizado. O conteúdo agora está pronto para assinatura.');
        } catch (err: any) {
            showToast(err.response?.data?.detail || 'Não foi possível finalizar o documento.', 'error');
        } finally {
            setIsFinalizingDocumento(false);
        }
    };

    const handleStartEditDocumento = (documento: Documento) => {
        if (documento.assinaturas?.length) {
            showToast('Documentos enviados para assinatura não podem ser editados.', 'error');
            return;
        }
        setConteudoDocumento(documento.conteudo);
        setIsEditingDocumento(true);
    };

    const handleSaveDocumento = async () => {
        if (!docVisualizar || !conteudoDocumento.trim()) return;
        setIsSavingDocumento(true);
        try {
            const response = await prontuarioService.editarDocumento(id, docVisualizar.id_documento, conteudoDocumento);
            if (isDocumentoApiError(response.data)) throw new Error(response.data.detalhes || response.data.erro);
            const updated: Documento = { ...docVisualizar, ...response.data };
            setDocumentos((current) => current.map((doc) => doc.id_documento === updated.id_documento ? updated : doc));
            setDocVisualizar(updated);
            setIsEditingDocumento(false);
            showToast('Documento atualizado com sucesso!');
        } catch (err: any) {
            console.error('Erro ao editar documento:', err);
            showToast(err.response?.data?.detail || err.message || 'Não foi possível editar o documento.', 'error');
        } finally {
            setIsSavingDocumento(false);
        }
    };

    const handleSignDocumento = async () => {
        if (!docVisualizar || docVisualizar.assinaturas?.length) return;
        setIsSigningDocumento(true);
        try {
            await prontuarioService.assinarDocumento(docVisualizar.id_documento);
            await fetchDocumentos();
            setDocVisualizar(null);
            showToast('Documento enviado para assinatura com sucesso!');
        } catch (err: any) {
            console.error('Erro ao enviar documento para assinatura:', err);
            showToast(err.response?.data?.detail || 'Não foi possível enviar o documento para assinatura.', 'error');
        } finally {
            setIsSigningDocumento(false);
        }
    };

    const handleDownloadAnexo = async (anexo: Anexo) => {
        setIsDownloadingAnexo(anexo.id_anexo);
        try {
            const response = await prontuarioService.downloadAnexo(anexo.id_anexo);
            const fileName = anexo.nome_arquivo || `anexo-${anexo.id_anexo}`;
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Erro ao baixar anexo:', err);
            showToast('Erro ao baixar o anexo.', 'error');
        } finally {
            setIsDownloadingAnexo(null);
        }
    };

    const handleUploadAnexo = async () => {
        if (!uploadAnexoFile) {
            showToast('Por favor, selecione um arquivo.', 'error');
            return;
        }

        setIsUploadingAnexo(true);
        const formData = new FormData();
        formData.append('file', uploadAnexoFile);
        formData.append('descricao', sanitizeText(uploadAnexoDescricao));

        try {
            await prontuarioService.uploadAnexo(id, formData);
            showToast('Arquivo anexado com sucesso!');
            setShowModalUploadAnexo(false);
            setUploadAnexoFile(null);
            setUploadAnexoDescricao('');
            fetchAnexos();
        } catch (err) {
            console.error('Erro ao fazer upload do anexo:', err);
            showToast('Erro ao enviar o arquivo. Tente novamente.', 'error');
        } finally {
            setIsUploadingAnexo(false);
        }
    };

    const handleDeleteAnexo = async (anexo: Anexo) => {
        setIsDeletingAnexo(anexo.id_anexo);
        try {
            await prontuarioService.deleteAnexo(anexo.id_anexo);
            setAnexos((current) => current.filter((item) => item.id_anexo !== anexo.id_anexo));
            showToast('Anexo excluído com sucesso!');
        } catch (err) {
            console.error('Erro ao excluir anexo:', err);
            showToast('Não foi possível excluir o anexo.', 'error');
        } finally {
            setIsDeletingAnexo(null);
        }
    };

    return {
        // Documentos
        documentos,
        isLoadingDocumentos,
        documentosFetched,
        fetchDocumentos,
        isDownloadingDoc,
        handleDownloadDocumento,
        documentoVisualizar: docVisualizar,
        setDocumentoVisualizar: setDocVisualizar,
        showModalGerarDocumento,
        setShowModalGerarDocumento,
        tiposDocumentos,
        tipoDocumentoSelecionado,
        variaveisDocumento,
        valoresDocumento,
        setValoresDocumento,
        documentoError,
        isLoadingTipos,
        isLoadingVariaveis,
        isGeneratingDocumento,
        previewDocumento,
        setPreviewDocumento,
        handleOpenGerarDocumento,
        handleSelectTipoDocumento,
        handlePreviewDocumento,
        handleGenerateDocumento,
        isEditingDocumento,
        setIsEditingDocumento,
        conteudoDocumento,
        setConteudoDocumento,
        isSavingDocumento,
        isSigningDocumento,
        isFinalizingDocumento,
        handleStartEditDocumento,
        handleSaveDocumento,
        handleFinalizarDocumento,
        handleSignDocumento,

        // Anexos
        anexos,
        isLoadingAnexos,
        anexosFetched,
        fetchAnexos,
        isDownloadingAnexo,
        handleDownloadAnexo,
        isDeletingAnexo,
        handleDeleteAnexo,

        // Upload
        showModalUploadAnexo,
        setShowModalUploadAnexo,
        isUploadingAnexo,
        uploadAnexoFile,
        setUploadAnexoFile,
        uploadAnexoDescricao,
        setUploadAnexoDescricao,
        handleUploadAnexo
    };
}
