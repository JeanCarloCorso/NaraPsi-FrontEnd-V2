import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    UserCircle2, Phone, Calendar,
    Edit, FileText, FileEdit, Paperclip, Plus, ArrowLeft, Loader2, AlertCircle, ChevronDown, ChevronRight, Download, CheckCircle, Trash2, Eye, Image as ImageIcon
} from 'lucide-react';
import api from '../services/api';
import { Editor } from '@tinymce/tinymce-react';

interface Familiar {
    nome: string;
    parentesco: string;
    profissao: string;
    telefone: string;
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

interface PacienteDetalhe {
    id_paciente: number;
    id_pessoa: number;
    nome: string;
    idade: number;
    sexo: string;
    data_nascimento: string;
    anotacoes: string;
    telefones: Telefone[];
    enderecos: Endereco[];
    familiares: Familiar[];
    ultima_data_sessao: string | null;
    pessoa: {
        id_pessoa: number;
        nome: string;
        cpf: string;
        rg: string;
        email: string;
        data_nascimento: string;
        sexo: string;
    };
}

interface Anexo {
    id_anexo: number;
    id_paciente: number;
    descricao: string;
    nome_arquivo: string;
    extensao: string;
    tamanho_bytes: number;
    data_envio: string;
}

interface Documento {
    id_documento: number;
    id_paciente: number;
    id_tipo_documento: number;
    nome: string;
    caminho_arquivo: string | null;
    data_criacao: string;
    data_atualizacao: string;
    conteudo: string;
    assinaturas: {
        id_pessoa: number;
        tipo_assinatura: string;
        status: string;
    }[];
}

interface Anamnese {
    id_anamneses?: number;
    id_paciente: number;
    estrutura_familiar: string;
    profissao: string;
    religiao: string;
    escolaridade: string;
    qualidade_sono: string;
    medicamentos: string;
    historico_familiar: string;
    trauma_relevante: string;
    hobbies: string;
    queixa_principal: string;
    evolucao_queixa: string;
    historia_pregressa: string;
    anotacoes_gerais: string;
}

interface PacienteFormData {
    nome: string;
    cpf: string;
    rg: string;
    email: string;
    data_nascimento: string;
    sexo: string;
    anotacoes: string;
    telefones: Telefone[];
    enderecos: Endereco[];
    familiares: Familiar[];
}

interface NotificationState {
    message: string;
    type: 'success' | 'error';
    visible: boolean;
}

interface Sessao {
    id_sessao: number;
    conteudo: string;
    data_sessao: string;
    situacao: 'EDITANDO' | 'CONCLUIDO';
}

export default function Prontuario() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState<PacienteDetalhe | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [sectionsOpen, setSectionsOpen] = useState({
        sessoes: false,
        documentos: false,
        arquivos: false
    });

    const [sessoes, setSessoes] = useState<Sessao[]>([]);
    const [isLoadingSessoes, setIsLoadingSessoes] = useState(false);
    const [sessoesFetched, setSessoesFetched] = useState(false);

    // Modal de visualização do relato
    const [sessaoVisualizar, setSessaoVisualizar] = useState<Sessao | null>(null);
    const [isDownloading, setIsDownloading] = useState<number | null>(null);

    // Exclusão de sessão
    const [sessaoExcluir, setSessaoExcluir] = useState<Sessao | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Formulário de Sessão (Novo/Editar)
    const [showModalSessao, setShowModalSessao] = useState(false);
    const [sessaoEdicaoId, setSessaoEdicaoId] = useState<number | null>(null);
    const [formSessaoData, setFormSessaoData] = useState(new Date().toISOString().split('T')[0]);
    const [formSessaoConteudo, setFormSessaoConteudo] = useState('');
    const [isSavingSessao, setIsSavingSessao] = useState(false);

    // Conclusão de sessão
    const [sessaoConcluir, setSessaoConcluir] = useState<Sessao | null>(null);
    const [isFinishingSessao, setIsFinishingSessao] = useState(false);

    // Edição do Paciente
    const [showModalPedidoEdicao, setShowModalPedidoEdicao] = useState(false);
    const [formDataPaciente, setFormDataPaciente] = useState<PacienteFormData>({
        nome: '',
        cpf: '',
        rg: '',
        email: '',
        data_nascimento: '',
        sexo: 'Masculino',
        anotacoes: '',
        telefones: [],
        enderecos: [],
        familiares: []
    });
    const [isSavingPaciente, setIsSavingPaciente] = useState(false);

    // Anamnese
    const [showModalAnamnese, setShowModalAnamnese] = useState(false);
    const [anamneseData, setAnamneseData] = useState<Anamnese>({
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
    const [isLoadingAnamnese, setIsLoadingAnamnese] = useState(false);
    const [isSavingAnamnese, setIsSavingAnamnese] = useState(false);

    // Documentos
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [isLoadingDocumentos, setIsLoadingDocumentos] = useState(false);
    const [documentosFetched, setDocumentosFetched] = useState(false);
    const [isDownloadingDoc, setIsDownloadingDoc] = useState<number | null>(null);

    // Anexos
    const [anexos, setAnexos] = useState<Anexo[]>([]);
    const [isLoadingAnexos, setIsLoadingAnexos] = useState(false);
    const [anexosFetched, setAnexosFetched] = useState(false);
    const [isDownloadingAnexo, setIsDownloadingAnexo] = useState<number | null>(null);
    const [showModalUploadAnexo, setShowModalUploadAnexo] = useState(false);
    const [uploadAnexoFile, setUploadAnexoFile] = useState<File | null>(null);
    const [uploadAnexoDescricao, setUploadAnexoDescricao] = useState('');
    const [isUploadingAnexo, setIsUploadingAnexo] = useState(false);

    const handleUpdateAnamneseField = (field: keyof Anamnese, value: any) => {
        setAnamneseData(prev => ({ ...prev, [field]: value }));
    };

    const handleOpenAnamnese = async () => {
        setIsLoadingAnamnese(true);
        setShowModalAnamnese(true);
        try {
            const response = await api.get(`/pacientes/${id}/anamnese`);
            if (response.data && response.data.id_anamneses) {
                setAnamneseData(response.data);
            } else {
                // Reset to empty if no data found
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
            // Even on error, we show the modal with empty data
        } finally {
            setIsLoadingAnamnese(false);
        }
    };

    const handleSaveAnamnese = async () => {
        setIsSavingAnamnese(true);
        try {
            await api.post(`/pacientes/${id}/anamnese`, anamneseData);
            showToast('Anamnese salva com sucesso!');
            setShowModalAnamnese(false);
        } catch (err) {
            console.error('Erro ao salvar anamnese:', err);
            showToast('Erro ao salvar a anamnese. Tente novamente.', 'error');
        } finally {
            setIsSavingAnamnese(false);
        }
    };

    // Notificações
    const [notification, setNotification] = useState<NotificationState>({
        message: '',
        type: 'success',
        visible: false
    });

    const [documentoVisualizar, setDocumentoVisualizar] = useState<Documento | null>(null);

    const handleViewDocumento = (doc: Documento) => {
        setDocumentoVisualizar(doc);
    };

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type, visible: true });
        setTimeout(() => {
            setNotification(prev => ({ ...prev, visible: false }));
        }, 10000);
    };

    const handleUpdateField = (field: keyof PacienteFormData, value: any) => {
        setFormDataPaciente(prev => ({ ...prev, [field]: value }));
    };

    const handleUpdateArrayField = (field: 'telefones' | 'enderecos' | 'familiares', index: number, subField: string, value: any) => {
        setFormDataPaciente(prev => {
            const newArray = [...(prev[field] || [])] as any[];
            newArray[index] = { ...newArray[index], [subField]: value };
            return { ...prev, [field]: newArray };
        });
    };

    const handleAddArrayItem = (field: 'telefones' | 'enderecos' | 'familiares') => {
        setFormDataPaciente(prev => {
            let newItem = {};
            if (field === 'telefones') newItem = { numero: '', descricao: '' };
            if (field === 'enderecos') newItem = { cep: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', pais: 'Brasil', descricao: '' };
            if (field === 'familiares') newItem = { nome: '', parentesco: '', profissao: '', telefone: '' };
            return { ...prev, [field]: [...(prev[field] || []), newItem] };
        });
    };

    const handleRemoveArrayItem = (field: 'telefones' | 'enderecos' | 'familiares', index: number) => {
        setFormDataPaciente(prev => {
            const newArray = (prev[field] || []).filter((_, i) => i !== index);
            return { ...prev, [field]: newArray };
        });
    };

    const toggleSection = async (section: keyof typeof sectionsOpen) => {
        const isOpening = !sectionsOpen[section];
        setSectionsOpen(prev => ({ ...prev, [section]: isOpening }));

        if (section === 'sessoes' && isOpening && !sessoesFetched) {
            setIsLoadingSessoes(true);
            try {
                const response = await api.get(`/pacientes/${id}/sessoes`);
                setSessoes(response.data);
                setSessoesFetched(true);
            } catch (err) {
                console.error("Erro ao carregar sessões:", err);
            } finally {
                setIsLoadingSessoes(false);
            }
        }

        if (section === 'documentos' && isOpening && !documentosFetched) {
            setIsLoadingDocumentos(true);
            try {
                const response = await api.get(`/paciente/${id}/documentos`);
                setDocumentos(response.data);
                setDocumentosFetched(true);
            } catch (err) {
                console.error("Erro ao carregar documentos:", err);
                showToast("Erro ao carregar documentos.", "error");
            } finally {
                setIsLoadingDocumentos(false);
            }
        }

        if (section === 'arquivos' && isOpening && !anexosFetched) {
            setIsLoadingAnexos(true);
            try {
                const response = await api.get(`/paciente/${id}/anexos`);
                setAnexos(response.data);
                setAnexosFetched(true);
            } catch (err) {
                console.error("Erro ao carregar anexos:", err);
                showToast("Erro ao carregar anexos.", "error");
            } finally {
                setIsLoadingAnexos(false);
            }
        }
    };

    const handleDownloadDocumento = async (doc: Documento) => {
        setIsDownloadingDoc(doc.id_documento);
        try {
            const response = await api.get(`/documento/${doc.id_documento}/download`, {
                responseType: 'blob'
            });

            // Extrair nome do arquivo do header se disponível
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
            const response = await api.get(`/anexo/${anexo.id_anexo}/download-anexo`, {
                responseType: 'blob'
            });

            const fileName = anexo.nome_arquivo;
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
        formData.append('descricao', uploadAnexoDescricao);

        try {
            await api.post(`/paciente/${id}/upload-anexo`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            showToast('Arquivo anexado com sucesso!');
            setShowModalUploadAnexo(false);
            setUploadAnexoFile(null);
            setUploadAnexoDescricao('');
            // Refresh list
            const response = await api.get(`/paciente/${id}/anexos`);
            setAnexos(response.data);
        } catch (err) {
            console.error('Erro ao fazer upload do anexo:', err);
            showToast('Erro ao enviar o arquivo. Tente novamente.', 'error');
        } finally {
            setIsUploadingAnexo(false);
        }
    };

    const handleDownload = async (sessao: Sessao) => {
        setIsDownloading(sessao.id_sessao);
        try {
            const response = await api.get(
                `/pacientes/${id}/sessoes/${sessao.id_sessao}/download`,
                { responseType: 'blob' }
            );

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
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Erro ao baixar sessão:', err);
        } finally {
            setIsDownloading(null);
        }
    };

    const handleVisualize = (sessao: Sessao) => {
        setSessaoVisualizar(sessao);
    };

    const handleDelete = async () => {
        if (!sessaoExcluir) return;

        setIsDeleting(true);
        try {
            await api.delete(`/pacientes/${id}/sessoes/${sessaoExcluir.id_sessao}`);
            setSessoes(prev => prev.filter(s => s.id_sessao !== sessaoExcluir.id_sessao));
            setSessaoExcluir(null);
        } catch (err) {
            console.error('Erro ao excluir sessão:', err);
            alert('Não foi possível excluir a sessão. Tente novamente mais tarde.');
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
            alert('Por favor, descreva o relato da sessão.');
            return;
        }

        setIsSavingSessao(true);
        try {
            const payload = {
                data_sessao: formSessaoData,
                conteudo: formSessaoConteudo
            };

            if (sessaoEdicaoId) {
                // Modo Edição (PUT)
                const response = await api.put(`/pacientes/${id}/sessoes/${sessaoEdicaoId}`, payload);
                setSessoes(prev => prev.map(s => s.id_sessao === sessaoEdicaoId ? response.data : s));
            } else {
                // Modo Novo (POST)
                const response = await api.post(`/pacientes/${id}/sessoes`, payload);
                setSessoes(prev => [response.data, ...prev]);
            }

            setShowModalSessao(false);
            setFormSessaoConteudo('');
            setFormSessaoData(new Date().toISOString().split('T')[0]);
            setSessaoEdicaoId(null);
        } catch (err) {
            console.error('Erro ao salvar sessão:', err);
            alert('Não foi possível salvar a sessão. Tente novamente.');
        } finally {
            setIsSavingSessao(false);
        }
    };

    const handleFinishSession = async () => {
        if (!sessaoConcluir) return;

        setIsFinishingSessao(true);
        try {
            const response = await api.patch(`/pacientes/${id}/sessoes/${sessaoConcluir.id_sessao}/concluir`);
            setSessoes(prev => prev.map(s => s.id_sessao === sessaoConcluir.id_sessao ? response.data : s));
            setSessaoConcluir(null);
        } catch (err) {
            console.error('Erro ao concluir sessão:', err);
            alert('Não foi possível concluir a sessão. Tente novamente.');
        } finally {
            setIsFinishingSessao(false);
        }
    };

    const handleOpenEditPaciente = () => {
        if (!paciente) return;

        // Flatten data from pessoa and format date for input[type="date"]
        const dateRaw = paciente.pessoa?.data_nascimento || paciente.data_nascimento || '';
        const dateFormatted = dateRaw.split(' ')[0]; // format "YYYY-MM-DD 00:00:00" -> "YYYY-MM-DD"

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
            const response = await api.put(`/paciente/${id}/editar`, formDataPaciente);
            setPaciente(response.data);
            setShowModalPedidoEdicao(false);
            showToast('Dados do paciente atualizados com sucesso!', 'success');
        } catch (err) {
            console.error('Erro ao atualizar paciente:', err);
            showToast('Erro ao atualizar dados do paciente. Tente novamente.', 'error');
        } finally {
            setIsSavingPaciente(false);
        }
    };

    useEffect(() => {
        const fetchPaciente = async () => {
            try {
                const response = await api.get(`/pacientes/${id}`);
                setPaciente(response.data);
            } catch (err: any) {
                if (err.response?.status === 404) {
                    try {
                        const allResponse = await api.get('/pacientes');
                        const found = allResponse.data.find((p: any) => p.id_paciente === Number(id));
                        if (found) {
                            setPaciente(found);
                        } else {
                            setError('Paciente não encontrado.');
                        }
                    } catch (fallbackErr) {
                        setError('Erro ao carregar os dados do paciente.');
                    }
                } else {
                    setError('Erro ao carregar os dados do paciente.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchPaciente();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    if (error || !paciente) {
        return (
            <div className="bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-500/20 flex flex-col items-center justify-center gap-3 min-h-[300px]">
                <AlertCircle className="w-8 h-8 shrink-0 mb-2" />
                <p className="font-medium text-lg">{error || 'Paciente não encontrado'}</p>
                <button onClick={() => navigate('/pacientes')} className="mt-4 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Voltar para Pacientes</button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            {/* Botão Voltar */}
            <button
                onClick={() => navigate('/pacientes')}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Voltar para Lista
            </button>

            {/* Cabeçalho do Prontuário */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center shrink-0">
                        <UserCircle2 className="w-8 h-8 text-primary-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">{paciente.nome}</h1>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                {paciente.idade} anos
                            </span>
                            <span className={`px-2.5 py-1 rounded-md border font-medium
                                ${paciente.sexo.toLowerCase() === 'feminino'
                                    ? 'bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-500/20'
                                    : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'}
                            `}>
                                {paciente.sexo}
                            </span>
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                {paciente.telefones && paciente.telefones.length > 0 ? paciente.telefones[0].numero : 'Não informado'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex w-full md:w-auto gap-3">
                    <button
                        onClick={handleOpenEditPaciente}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl font-medium transition-colors shadow-sm"
                    >
                        <Edit className="w-4 h-4" />
                        Editar Dados
                    </button>
                    <button
                        onClick={handleOpenAnamnese}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-sm shadow-primary-500/30"
                    >
                        <FileEdit className="w-4 h-4" />
                        Anamnese
                    </button>
                </div>
            </div>

            {/* Grid de Seções */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Coluna Principal (Sessões) */}
                <div className="lg:col-span-2 space-y-6">
                    <section className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col transition-all overflow-hidden ${sectionsOpen.sessoes ? 'min-h-[400px]' : ''}`}>
                        <div className={`flex items-center justify-between ${sectionsOpen.sessoes ? 'mb-6 pb-4 border-b border-slate-100 dark:border-slate-800' : ''}`}>
                            <button onClick={() => toggleSection('sessoes')} className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-1 text-left">
                                {sectionsOpen.sessoes ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                                <FileText className="w-5 h-5 text-primary-500" />
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Sessões Terapêuticas</h2>
                            </button>
                            <button
                                onClick={handleOpenNewModal}
                                className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors z-10 relative"
                            >
                                <Plus className="w-4 h-4" />
                                Adicionar
                            </button>
                        </div>

                        {/* States das Sessões */}
                        {sectionsOpen.sessoes && isLoadingSessoes && (
                            <div className="flex-1 flex items-center justify-center p-8">
                                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                            </div>
                        )}

                        {sectionsOpen.sessoes && !isLoadingSessoes && sessoes.length === 0 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-in fade-in slide-in-from-top-4">
                                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                                    <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                                </div>
                                <h3 className="text-slate-700 dark:text-slate-200 font-medium mb-1">Nenhuma sessão registrada.</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                                    Comece documentando o progresso do paciente criando a primeira anotação de sessão.
                                </p>
                                <button
                                    onClick={handleOpenNewModal}
                                    className="px-5 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Registrar Sessão
                                </button>
                            </div>
                        )}

                        {sectionsOpen.sessoes && !isLoadingSessoes && sessoes.length > 0 && (
                            <div className="flex-1 space-y-4 mt-2 animate-in fade-in slide-in-from-top-4">
                                {sessoes.map((sessao) => (
                                    <div key={sessao.id_sessao} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 sm:px-6 border border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="font-medium text-slate-800 dark:text-slate-200">
                                                Sessão #{sessao.id_sessao}
                                            </div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(sessao.data_sessao + "T12:00:00").toLocaleDateString('pt-BR')}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${sessao.situacao === 'CONCLUIDO'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                                : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                                                }`}>
                                                {sessao.situacao === 'CONCLUIDO' ? 'CONCLUÍDO' : 'EDITANDO'}
                                            </span>

                                            <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 dark:border-slate-700 pl-3">
                                                {sessao.situacao === 'EDITANDO' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleOpenEditModal(sessao)}
                                                            className="p-1.5 text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all shadow-sm"
                                                            title="Editar"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setSessaoExcluir(sessao)}
                                                            className="p-1.5 text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-all shadow-sm"
                                                            title="Excluir"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setSessaoConcluir(sessao)}
                                                            className="p-1.5 text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-all shadow-sm"
                                                            title="Concluir"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleVisualize(sessao)}
                                                            className="p-1.5 text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-all shadow-sm"
                                                            title="Visualizar relato"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownload(sessao)}
                                                            disabled={isDownloading === sessao.id_sessao}
                                                            className="p-1.5 text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title="Baixar relato"
                                                        >
                                                            {isDownloading === sessao.id_sessao
                                                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                                                : <Download className="w-4 h-4" />}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Coluna Lateral (Documentos e Arquivos) */}
                <div className="space-y-6">

                    {/* Documentos */}
                    <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-all overflow-hidden">
                        <div className={`flex items-center justify-between ${sectionsOpen.documentos ? 'mb-4 pb-3 border-b border-slate-100 dark:border-slate-800' : ''}`}>
                            <button onClick={() => toggleSection('documentos')} className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-1 text-left">
                                {sectionsOpen.documentos ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                                <FileEdit className="w-5 h-5 text-indigo-500" />
                                <h2 className="font-semibold text-slate-800 dark:text-slate-100">Documentos</h2>
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-slate-50 dark:hover:bg-primary-500/10 transition-colors z-10 relative">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Document List */}
                        {sectionsOpen.documentos && (
                            <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-4">
                                {isLoadingDocumentos ? (
                                    <div className="flex justify-center py-6">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                                    </div>
                                ) : documentos.length === 0 ? (
                                    <div className="py-8 text-center flex flex-col items-center">
                                        <FileEdit className="w-8 h-8 text-slate-200 dark:text-slate-700 mb-2" />
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Nenhum documento gerado.</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Laudos, atestados ou declarações aparecerão aqui.</p>
                                    </div>
                                ) : (
                                    documentos.map((doc) => (
                                        <div
                                            key={doc.id_documento}
                                            className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 hover:border-primary-200 dark:hover:border-primary-500/30 transition-all"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                                                    <FileText className="w-4.5 h-4.5 text-indigo-500" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate pr-2" title={doc.nome}>
                                                        {doc.nome}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                                            {new Date(doc.data_criacao).toLocaleDateString('pt-BR')}
                                                        </span>
                                                        {doc.assinaturas && doc.assinaturas.some(s => s.status === 'signed') && (
                                                            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 uppercase tracking-tighter">
                                                                Assinado
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                                                <button
                                                    onClick={() => handleViewDocumento(doc)}
                                                    className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors shadow-sm"
                                                    title="Visualizar documento"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadDocumento(doc)}
                                                    disabled={isDownloadingDoc === doc.id_documento}
                                                    className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                                                    title="Baixar PDF"
                                                >
                                                    {isDownloadingDoc === doc.id_documento ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Download className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </section>

                    {/* Arquivos Anexados */}
                    <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-all overflow-hidden">
                        <div className={`flex items-center justify-between ${sectionsOpen.arquivos ? 'mb-4 pb-3 border-b border-slate-100 dark:border-slate-800' : ''}`}>
                            <button onClick={() => toggleSection('arquivos')} className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-1 text-left">
                                {sectionsOpen.arquivos ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                                <Paperclip className="w-5 h-5 text-emerald-500" />
                                <h2 className="font-semibold text-slate-800 dark:text-slate-100">Arquivos Anexados</h2>
                            </button>
                            <button
                                onClick={() => setShowModalUploadAnexo(true)}
                                className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-slate-50 dark:hover:bg-primary-500/10 transition-colors z-10 relative"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {/* File list */}
                        {sectionsOpen.arquivos && (
                            <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-4">
                                {isLoadingAnexos ? (
                                    <div className="flex justify-center py-6">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                                    </div>
                                ) : anexos.length === 0 ? (
                                    <div className="py-8 text-center flex flex-col items-center">
                                        <Paperclip className="w-8 h-8 text-slate-200 dark:text-slate-700 mb-2" />
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Nenhum arquivo anexado.</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Faça upload de exames e PDFs importantes.</p>
                                    </div>
                                ) : (
                                    anexos.map((anexo) => {
                                        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(anexo.extensao.toLowerCase());
                                        const isPdf = anexo.extensao.toLowerCase() === 'pdf';

                                        return (
                                            <div
                                                key={anexo.id_anexo}
                                                className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 hover:border-primary-200 dark:hover:border-primary-500/30 transition-all"
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 
                                                        ${isPdf ? 'bg-indigo-50 dark:bg-indigo-500/10' :
                                                            isImage ? 'bg-amber-50 dark:bg-amber-500/10' :
                                                                'bg-emerald-50 dark:bg-emerald-500/10'}
                                                    `}>
                                                        {isPdf ? (
                                                            <FileText className="w-4.5 h-4.5 text-indigo-500" />
                                                        ) : isImage ? (
                                                            <ImageIcon className="w-4.5 h-4.5 text-amber-500" />
                                                        ) : (
                                                            <Paperclip className="w-4.5 h-4.5 text-emerald-500" />
                                                        )}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate pr-2" title={anexo.nome_arquivo}>
                                                            {anexo.nome_arquivo}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                                                {new Date(anexo.data_envio).toLocaleDateString('pt-BR')} • {(anexo.tamanho_bytes / 1024).toFixed(1)} KB
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                                                    <button
                                                        onClick={() => handleDownloadAnexo(anexo)}
                                                        disabled={isDownloadingAnexo === anexo.id_anexo}
                                                        className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                                                        title="Baixar arquivo"
                                                    >
                                                        {isDownloadingAnexo === anexo.id_anexo ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Download className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* Modal de Visualização do Relato */}
            {sessaoVisualizar && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    onClick={() => setSessaoVisualizar(null)}
                >
                    <div
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-3xl max-h-[85vh] flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header do Modal */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                    Relato — Sessão #{sessaoVisualizar.id_sessao}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date((sessaoVisualizar.data_sessao ?? "") + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => sessaoVisualizar && handleDownload(sessaoVisualizar)}
                                    disabled={isDownloading === sessaoVisualizar.id_sessao}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 bg-slate-50 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-500/10 border border-slate-200 dark:border-slate-700 rounded-lg transition-all disabled:opacity-50"
                                    title="Baixar relato"
                                >
                                    {isDownloading === sessaoVisualizar.id_sessao
                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        : <Download className="w-3.5 h-3.5" />}
                                    Baixar
                                </button>
                                <button
                                    onClick={() => setSessaoVisualizar(null)}
                                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                    title="Fechar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Conteúdo do relato */}
                        <div className="overflow-y-auto flex-1 px-6 py-5">
                            {sessaoVisualizar.conteudo ? (
                                <div
                                    className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: sessaoVisualizar.conteudo }}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
                                    <FileText className="w-10 h-10 mb-3 text-slate-200 dark:text-slate-700" />
                                    <p className="text-sm">Este relato não possui conteúdo.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Exclusão */}
            {sessaoExcluir && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => !isDeleting && setSessaoExcluir(null)}
                >
                    <div
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4">
                                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                Excluir Sessão?
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Tem certeza que deseja excluir a <strong>Sessão #{sessaoExcluir.id_sessao}</strong>?
                                Esta ação é irreversível e todos os dados do relato serão perdidos permanentemente.
                            </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-semibold transition-colors shadow-sm shadow-red-500/20"
                            >
                                {isDeleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                                Excluir Permanentemente
                            </button>
                            <button
                                onClick={() => setSessaoExcluir(null)}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Registro/Edição de Sessão */}
            {showModalSessao && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => !isSavingSessao && setShowModalSessao(false)}
                >
                    <div
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                    {sessaoEdicaoId ? 'Editar Sessão' : 'Registrar Nova Sessão'}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {sessaoEdicaoId ? `Editando registro da sessão #${sessaoEdicaoId}` : 'Documente o progresso do atendimento'}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModalSessao(false)}
                                disabled={isSavingSessao}
                                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>

                        {/* Conteúdo do formulário */}
                        <div className="overflow-y-auto flex-1 p-6 space-y-6">
                            {/* Campo de Data */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    Data da Sessão
                                </label>
                                <input
                                    type="date"
                                    value={formSessaoData}
                                    onChange={(e) => setFormSessaoData(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-slate-900 dark:text-white transition-all"
                                />
                            </div>

                            {/* Campo de Relato (TinyMCE) */}
                            <div className="flex flex-col h-[400px]">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-slate-400" />
                                    Relato da Sessão
                                </label>
                                <div className="flex-1 flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 min-h-[400px]">
                                    <Editor
                                        apiKey={import.meta.env.VITE_API_TINY_KEY}
                                        value={formSessaoConteudo}
                                        onEditorChange={(content) => setFormSessaoConteudo(content)}
                                        init={{
                                            height: '100%',
                                            menubar: false,
                                            plugins: [
                                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                            ],
                                            toolbar: 'undo redo | blocks | ' +
                                                'bold italic underline | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help',
                                            content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size:14px }',
                                            skin: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oxide-dark' : 'oxide',
                                            content_css: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 shrink-0">
                            <button
                                onClick={handleSaveSessao}
                                disabled={isSavingSessao}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-semibold transition-all shadow-sm shadow-primary-500/20"
                            >
                                {isSavingSessao ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-4 h-4" />
                                )}
                                {sessaoEdicaoId ? 'Salvar Alterações' : 'Salvar Registro'}
                            </button>
                            <button
                                onClick={() => setShowModalSessao(false)}
                                disabled={isSavingSessao}
                                className="flex-1 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Conclusão */}
            {sessaoConcluir && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => !isFinishingSessao && setSessaoConcluir(null)}
                >
                    <div
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-4">
                                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                Concluir Sessão?
                            </h3>
                            <div className="space-y-3">
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Tem certeza que deseja concluir a <strong>Sessão #{sessaoConcluir.id_sessao}</strong>?
                                </p>
                                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 p-3 rounded-xl flex gap-3 text-sm text-amber-800 dark:text-amber-300">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p>
                                        Após a conclusão, <strong>não será mais possível editar ou excluir</strong> este relato de sessão. Esta ação garante a integridade do prontuário do paciente.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
                            <button
                                onClick={handleFinishSession}
                                disabled={isFinishingSessao}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl font-semibold transition-colors shadow-sm shadow-emerald-500/20"
                            >
                                {isFinishingSessao ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-4 h-4" />
                                )}
                                Confirmar Conclusão
                            </button>
                            <button
                                onClick={() => setSessaoConcluir(null)}
                                disabled={isFinishingSessao}
                                className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Edição de Dados do Paciente */}
            {showModalPedidoEdicao && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => !isSavingPaciente && setShowModalPedidoEdicao(false)}
                >
                    <div
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Editar Dados do Paciente</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Atualize as informações cadastrais</p>
                            </div>
                            <button
                                onClick={() => setShowModalPedidoEdicao(false)}
                                disabled={isSavingPaciente}
                                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>

                        {/* Conteúdo do formulário */}
                        <div className="overflow-y-auto flex-1 p-6 space-y-8">
                            {/* Dados Pessoais */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <UserCircle2 className="w-4 h-4" /> Dados Pessoais
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Nome Completo</label>
                                        <input
                                            type="text"
                                            value={formDataPaciente.nome || ''}
                                            onChange={(e) => handleUpdateField('nome', e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Sexo</label>
                                        <select
                                            value={formDataPaciente.sexo || ''}
                                            onChange={(e) => handleUpdateField('sexo', e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                        >
                                            <option value="Masculino">Masculino</option>
                                            <option value="Feminino">Feminino</option>
                                            <option value="Outro">Outro</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">CPF</label>
                                        <input
                                            type="text"
                                            value={formDataPaciente.cpf || ''}
                                            onChange={(e) => handleUpdateField('cpf', e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">RG</label>
                                        <input
                                            type="text"
                                            value={formDataPaciente.rg || ''}
                                            onChange={(e) => handleUpdateField('rg', e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Data de Nascimento</label>
                                        <input
                                            type="date"
                                            value={formDataPaciente.data_nascimento || ''}
                                            onChange={(e) => handleUpdateField('data_nascimento', e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2 lg:col-span-3">
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">E-mail</label>
                                        <input
                                            type="email"
                                            value={formDataPaciente.email || ''}
                                            onChange={(e) => handleUpdateField('email', e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                        />
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
                                        onClick={() => handleAddArrayItem('telefones')}
                                        className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> Adicionar Telefone
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {(formDataPaciente.telefones || []).map((tel, idx) => (
                                        <div key={idx} className="flex gap-3 items-end bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <div className="flex-1">
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Número</label>
                                                <input
                                                    type="text"
                                                    value={tel.numero}
                                                    onChange={(e) => handleUpdateArrayField('telefones', idx, 'numero', e.target.value)}
                                                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Descrição</label>
                                                <input
                                                    type="text"
                                                    value={tel.descricao}
                                                    onChange={(e) => handleUpdateArrayField('telefones', idx, 'descricao', e.target.value)}
                                                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    placeholder="Ex: Celular, Casa"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveArrayItem('telefones', idx)}
                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
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
                                        onClick={() => handleAddArrayItem('enderecos')}
                                        className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> Adicionar Endereço
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {(formDataPaciente.enderecos || []).map((end, idx) => (
                                        <div key={idx} className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                                            <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-2 -m-4 mb-3 rounded-t-xl px-4 border-b border-slate-200 dark:border-slate-700">
                                                <span className="text-xs font-bold text-slate-500">Endereço #{idx + 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveArrayItem('enderecos', idx)}
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
                                                        value={end.cep}
                                                        onChange={(e) => handleUpdateArrayField('enderecos', idx, 'cep', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Endereço (Rua/Av)</label>
                                                    <input
                                                        type="text"
                                                        value={end.endereco}
                                                        onChange={(e) => handleUpdateArrayField('enderecos', idx, 'endereco', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Número</label>
                                                    <input
                                                        type="text"
                                                        value={end.numero}
                                                        onChange={(e) => handleUpdateArrayField('enderecos', idx, 'numero', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Complemento</label>
                                                    <input
                                                        type="text"
                                                        value={end.complemento}
                                                        onChange={(e) => handleUpdateArrayField('enderecos', idx, 'complemento', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Bairro</label>
                                                    <input
                                                        type="text"
                                                        value={end.bairro}
                                                        onChange={(e) => handleUpdateArrayField('enderecos', idx, 'bairro', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Cidade</label>
                                                    <input
                                                        type="text"
                                                        value={end.cidade}
                                                        onChange={(e) => handleUpdateArrayField('enderecos', idx, 'cidade', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Estado</label>
                                                    <input
                                                        type="text"
                                                        value={end.estado}
                                                        onChange={(e) => handleUpdateArrayField('enderecos', idx, 'estado', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">País</label>
                                                    <input
                                                        type="text"
                                                        value={end.pais}
                                                        onChange={(e) => handleUpdateArrayField('enderecos', idx, 'pais', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
                                        onClick={() => handleAddArrayItem('familiares')}
                                        className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> Adicionar Familiar
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {(formDataPaciente.familiares || []).map((fam, idx) => (
                                        <div key={idx} className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                                            <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-2 -m-4 mb-3 rounded-t-xl px-4 border-b border-slate-200 dark:border-slate-700">
                                                <span className="text-xs font-bold text-slate-500">Familiar #{idx + 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveArrayItem('familiares', idx)}
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
                                                        value={fam.nome}
                                                        onChange={(e) => handleUpdateArrayField('familiares', idx, 'nome', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Parentesco</label>
                                                    <input
                                                        type="text"
                                                        value={fam.parentesco}
                                                        onChange={(e) => handleUpdateArrayField('familiares', idx, 'parentesco', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Telefone</label>
                                                    <input
                                                        type="text"
                                                        value={fam.telefone}
                                                        onChange={(e) => handleUpdateArrayField('familiares', idx, 'telefone', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                                <div className="lg:col-span-2">
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Profissão</label>
                                                    <input
                                                        type="text"
                                                        value={fam.profissao}
                                                        onChange={(e) => handleUpdateArrayField('familiares', idx, 'profissao', e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Anotações */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <FileEdit className="w-4 h-4" /> Anotações Adicionais
                                </h4>
                                <textarea
                                    value={formDataPaciente.anotacoes || ''}
                                    onChange={(e) => handleUpdateField('anotacoes', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all resize-none"
                                    placeholder="Anotações gerais sobre o paciente..."
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 shrink-0">
                            <button
                                onClick={handleUpdatePaciente}
                                disabled={isSavingPaciente}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-semibold transition-all shadow-sm shadow-primary-500/20"
                            >
                                {isSavingPaciente ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-4 h-4" />
                                )}
                                Salvar Alterações
                            </button>
                            <button
                                onClick={() => setShowModalPedidoEdicao(false)}
                                disabled={isSavingPaciente}
                                className="flex-1 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Anamnese */}
            {showModalAnamnese && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => !isSavingAnamnese && setShowModalAnamnese(false)}
                >
                    <div
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
                                    <FileEdit className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Anamnese do Paciente</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Histórico detalhado e queixas</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModalAnamnese(false)}
                                disabled={isSavingAnamnese}
                                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>

                        {/* Conteúdo */}
                        <div className="overflow-y-auto flex-1 p-6 space-y-8">
                            {isLoadingAnamnese ? (
                                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                    <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                                    <p className="text-slate-500 dark:text-slate-400 animate-pulse">Carregando anamnese...</p>
                                </div>
                            ) : (
                                <>
                                    {/* Seção 1: Identificação e Contexto */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l-2 border-primary-500 pl-2">Contexto e Perfil</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Profissão</label>
                                                <input
                                                    type="text"
                                                    value={anamneseData.profissao}
                                                    onChange={(e) => handleUpdateAnamneseField('profissao', e.target.value)}
                                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Escolaridade</label>
                                                <input
                                                    type="text"
                                                    value={anamneseData.escolaridade}
                                                    onChange={(e) => handleUpdateAnamneseField('escolaridade', e.target.value)}
                                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Religião</label>
                                                <input
                                                    type="text"
                                                    value={anamneseData.religiao}
                                                    onChange={(e) => handleUpdateAnamneseField('religiao', e.target.value)}
                                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Hobbies e Atividades</label>
                                                <input
                                                    type="text"
                                                    value={anamneseData.hobbies}
                                                    onChange={(e) => handleUpdateAnamneseField('hobbies', e.target.value)}
                                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Seção 2: Queixa do Paciente */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l-2 border-primary-500 pl-2">A Queixa</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Queixa Principal (MOTIVO)</label>
                                                <textarea
                                                    value={anamneseData.queixa_principal}
                                                    onChange={(e) => handleUpdateAnamneseField('queixa_principal', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all resize-none"
                                                    placeholder="Qual o motivo principal da busca pelo atendimento?"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Evolução da Queixa</label>
                                                <textarea
                                                    value={anamneseData.evolucao_queixa}
                                                    onChange={(e) => handleUpdateAnamneseField('evolucao_queixa', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all resize-none"
                                                    placeholder="Como e quando os sintomas começaram e como evoluíram?"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Seção 3: Histórico e Saúde */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l-2 border-primary-500 pl-2">Saúde e Histórico</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Estrutura Familiar</label>
                                                <textarea
                                                    value={anamneseData.estrutura_familiar}
                                                    onChange={(e) => handleUpdateAnamneseField('estrutura_familiar', e.target.value)}
                                                    rows={2}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all resize-none"
                                                    placeholder="Quem mora com o paciente? Como é o núcleo familiar?"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Qualidade do Sono</label>
                                                <input
                                                    type="text"
                                                    value={anamneseData.qualidade_sono}
                                                    onChange={(e) => handleUpdateAnamneseField('qualidade_sono', e.target.value)}
                                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Medicamentos em Uso</label>
                                                <input
                                                    type="text"
                                                    value={anamneseData.medicamentos}
                                                    onChange={(e) => handleUpdateAnamneseField('medicamentos', e.target.value)}
                                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Histórico Familiar relevante</label>
                                                <textarea
                                                    value={anamneseData.historico_familiar}
                                                    onChange={(e) => handleUpdateAnamneseField('historico_familiar', e.target.value)}
                                                    rows={2}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all resize-none"
                                                    placeholder="Casos de transtornos mentais, doenças graves ou eventos marcantes na família."
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Traumas Relevantes</label>
                                                <textarea
                                                    value={anamneseData.trauma_relevante}
                                                    onChange={(e) => handleUpdateAnamneseField('trauma_relevante', e.target.value)}
                                                    rows={2}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all resize-none"
                                                    placeholder="Lutos, separações, acidentes ou outros traumas."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Seção 4: História Pregressa e Anotações */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l-2 border-primary-500 pl-2">História e Notas</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">História Pregressa</label>
                                                <textarea
                                                    value={anamneseData.historia_pregressa}
                                                    onChange={(e) => handleUpdateAnamneseField('historia_pregressa', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all resize-none"
                                                    placeholder="Antecedentes pessoais, desenvolvimento e tratamentos anteriores."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">Anotações Gerais</label>
                                                <textarea
                                                    value={anamneseData.anotacoes_gerais}
                                                    onChange={(e) => handleUpdateAnamneseField('anotacoes_gerais', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white transition-all resize-none"
                                                    placeholder="Observações complementares..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 shrink-0">
                            <button
                                onClick={handleSaveAnamnese}
                                disabled={isSavingAnamnese || isLoadingAnamnese}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-semibold transition-all shadow-sm shadow-primary-500/20"
                            >
                                {isSavingAnamnese ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-4 h-4" />
                                )}
                                Salvar Anamnese
                            </button>
                            <button
                                onClick={() => setShowModalAnamnese(false)}
                                disabled={isSavingAnamnese}
                                className="flex-1 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Upload de Anexo */}
            {showModalUploadAnexo && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Anexar Novo Arquivo</h3>
                            <button
                                onClick={() => setShowModalUploadAnexo(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Arquivo
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        onChange={(e) => setUploadAnexoFile(e.target.files?.[0] || null)}
                                        className="w-full text-sm text-slate-500 dark:text-slate-400
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-xl file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-primary-50 file:text-primary-700
                                            dark:file:bg-primary-500/10 dark:file:text-primary-400
                                            hover:file:bg-primary-100 dark:hover:file:bg-primary-500/20
                                            transition-all cursor-pointer"
                                    />
                                    {uploadAnexoFile && (
                                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                                            {uploadAnexoFile.name} ({(uploadAnexoFile.size / 1024).toFixed(1)} KB)
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Descrição
                                </label>
                                <textarea
                                    value={uploadAnexoDescricao}
                                    onChange={(e) => setUploadAnexoDescricao(e.target.value)}
                                    placeholder="Ex: Resultado de exame de sangue, Encaminhamento médico..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none h-24"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row-reverse gap-3 rounded-b-2xl">
                            <button
                                onClick={handleUploadAnexo}
                                disabled={isUploadingAnexo || !uploadAnexoFile}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-semibold transition-all shadow-sm shadow-primary-500/20"
                            >
                                {isUploadingAnexo ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Paperclip className="w-4 h-4" />
                                )}
                                Anexar Arquivo
                            </button>
                            <button
                                onClick={() => setShowModalUploadAnexo(false)}
                                disabled={isUploadingAnexo}
                                className="flex-1 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Visualização de Documento */}
            {documentoVisualizar && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setDocumentoVisualizar(null)}
                >
                    <div
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{documentoVisualizar.nome}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        Gerado em {new Date(documentoVisualizar.data_criacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDocumentoVisualizar(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>

                        {/* Conteúdo HTML */}
                        <div className="overflow-y-auto flex-1 p-8 bg-slate-50/30 dark:bg-slate-900/50">
                            <div
                                className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 sm:p-12 shadow-sm border border-slate-100 dark:border-slate-700 rounded-xl prose dark:prose-invert prose-slate max-w-none
                                    text-slate-900 dark:text-white
                                    prose-headings:text-slate-900 dark:prose-headings:text-white
                                    prose-p:text-slate-900 dark:prose-p:text-slate-100
                                    prose-strong:text-slate-900 dark:prose-strong:text-white
                                    prose-span:text-slate-900 dark:prose-span:text-slate-100
                                "
                                dangerouslySetInnerHTML={{ __html: documentoVisualizar.conteudo }}
                            />
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 shrink-0">
                            <button
                                onClick={() => handleDownloadDocumento(documentoVisualizar)}
                                disabled={isDownloadingDoc === documentoVisualizar.id_documento}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-semibold transition-all shadow-sm shadow-primary-500/20"
                            >
                                {isDownloadingDoc === documentoVisualizar.id_documento ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4" />
                                )}
                                Baixar PDF
                            </button>
                            <button
                                onClick={() => setDocumentoVisualizar(null)}
                                className="flex-1 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold transition-colors"
                            >
                                Fechar
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
