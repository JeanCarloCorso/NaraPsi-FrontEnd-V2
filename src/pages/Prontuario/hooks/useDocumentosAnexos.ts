import { useState, useCallback } from 'react';
import { prontuarioService } from '../services/prontuarioService';
import { sanitizeText } from '../../../utils/validators';
import type { Documento, Anexo } from '../types';

export function useDocumentosAnexos(id: string, showToast: (msg: string, type?: 'success' | 'error') => void) {
    // Documentos
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [isLoadingDocumentos, setIsLoadingDocumentos] = useState(false);
    const [documentosFetched, setDocumentosFetched] = useState(false);
    const [isDownloadingDoc, setIsDownloadingDoc] = useState<number | null>(null);
    const [docVisualizar, setDocVisualizar] = useState<Documento | null>(null);

    // Anexos
    const [anexos, setAnexos] = useState<Anexo[]>([]);
    const [isLoadingAnexos, setIsLoadingAnexos] = useState(false);
    const [anexosFetched, setAnexosFetched] = useState(false);
    const [isDownloadingAnexo, setIsDownloadingAnexo] = useState<number | null>(null);

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

        // Anexos
        anexos,
        isLoadingAnexos,
        anexosFetched,
        fetchAnexos,
        isDownloadingAnexo,
        handleDownloadAnexo,

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
