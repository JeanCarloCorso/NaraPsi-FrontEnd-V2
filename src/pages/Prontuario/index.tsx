import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Plus, Calendar, Download } from 'lucide-react';

// Hooks
import { useProntuario } from './hooks/useProntuario';
import { useSessoes } from './hooks/useSessoes';
import { useAnamnese } from './hooks/useAnamnese';
import { useDocumentosAnexos } from './hooks/useDocumentosAnexos';

// Components - Layout
import { Header } from './components/Header';
import { SessoesList } from './components/SessoesList';
import { DocumentosSection } from './components/Sidebar/DocumentosSection';
import { AnexosSection } from './components/Sidebar/AnexosSection';

// Components - Modals
import { EdicaoPacienteModal } from './components/Modals/EdicaoPacienteModal';
import { AnamneseModal } from './components/Modals/AnamneseModal';
import { SessaoModal } from './components/Modals/SessaoModal';
import { ConfirmacaoExclusaoModal, ConfirmacaoConclusaoModal } from './components/Modals/Confirmacoes';
import { UploadAnexoModal } from './components/Modals/UploadAnexoModal';
import { DocVisualizarModal } from './components/Modals/DocVisualizarModal';
import { Toast } from './components/Modals/Toast';

export default function Prontuario() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Estado local para controle das seções (expansível/colapsável)
    const [sectionsOpen, setSectionsOpen] = useState({
        sessoes: false,
        documentos: false,
        arquivos: false
    });

    // Hook Principal (Paciente e UI)
    const {
        paciente,
        isLoading,
        error,
        notification,
        showToast,
        showModalPedidoEdicao,
        setShowModalPedidoEdicao,
        isSavingPaciente,
        formDataPaciente,
        handleOpenEditPaciente,
        handleUpdateField,
        handleUpdateArrayField,
        handleAddArrayItem,
        handleRemoveArrayItem,
        handleUpdatePaciente,
        fieldErrors: fieldErrorsPaciente
    } = useProntuario();

    const closeNotification = () => { /* Implicitly handled by hook */ };

    // Hook de Sessões
    const {
        sessoes,
        isLoadingSessoes,
        fetchSessoes,
        isSavingSessao,
        isDeleting,
        isFinishingSessao,
        isDownloading,
        showModalSessao,
        setShowModalSessao,
        sessaoEdicaoId,
        formSessaoData,
        setFormSessaoData,
        formSessaoConteudo,
        setFormSessaoConteudo,
        sessaoVisualizar,
        setSessaoVisualizar,
        sessaoExcluir,
        setSessaoExcluir,
        sessaoConcluir,
        setSessaoConcluir,
        handleOpenNewModal,
        handleOpenEditModal,
        handleSaveSessao,
        handleDelete,
        handleFinishSession,
        handleDownload,
        fieldErrors: fieldErrorsSessao
    } = useSessoes(id as string, showToast);

    // Hook de Anamnese
    const {
        anamneseData,
        isLoadingAnamnese,
        isSavingAnamnese,
        showModalAnamnese,
        setShowModalAnamnese,
        handleOpenAnamnese,
        handleUpdateAnamneseField,
        handleSaveAnamnese
    } = useAnamnese(id as string, showToast);

    // Hook de Documentos e Anexos
    const {
        documentos,
        anexos,
        isLoadingDocumentos,
        isLoadingAnexos,
        isDownloadingDoc,
        isDownloadingAnexo,
        isUploadingAnexo,
        showModalUploadAnexo,
        setShowModalUploadAnexo,
        documentoVisualizar,
        setDocumentoVisualizar,
        uploadAnexoFile,
        setUploadAnexoFile,
        uploadAnexoDescricao,
        setUploadAnexoDescricao,
        handleDownloadDocumento,
        handleDownloadAnexo,
        handleUploadAnexo,
        fetchDocumentos,
        fetchAnexos
    } = useDocumentosAnexos(id as string, showToast);

    const toggleSection = (section: keyof typeof sectionsOpen) => {
        const newState = !sectionsOpen[section];
        setSectionsOpen(prev => ({ ...prev, [section]: newState }));

        if (newState) {
            if (section === 'sessoes') fetchSessoes();
            if (section === 'documentos') fetchDocumentos();
            if (section === 'arquivos') fetchAnexos();
        }
    };

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
        <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
            <Header
                paciente={paciente}
                onEditClick={handleOpenEditPaciente}
                onAnamneseClick={handleOpenAnamnese}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <SessoesList
                        isOpen={sectionsOpen.sessoes}
                        onToggle={() => toggleSection('sessoes')}
                        isLoading={isLoadingSessoes}
                        sessoes={sessoes}
                        onNewSessao={handleOpenNewModal}
                        onEditSessao={handleOpenEditModal}
                        onDeleteSessao={(s) => setSessaoExcluir(s)}
                        onConcluirSessao={(s) => setSessaoConcluir(s)}
                        onVisualizeSessao={(s) => setSessaoVisualizar(s)}
                        onDownloadSessao={handleDownload}
                        isDownloading={isDownloading}
                    />
                </div>

                <div className="space-y-6">
                    <DocumentosSection
                        isOpen={sectionsOpen.documentos}
                        onToggle={() => toggleSection('documentos')}
                        isLoading={isLoadingDocumentos}
                        documentos={documentos}
                        onView={(doc) => setDocumentoVisualizar(doc)}
                        onDownload={handleDownloadDocumento}
                        isDownloadingDoc={isDownloadingDoc}
                    />

                    <AnexosSection
                        isOpen={sectionsOpen.arquivos}
                        onToggle={() => toggleSection('arquivos')}
                        isLoading={isLoadingAnexos}
                        anexos={anexos}
                        onDownload={handleDownloadAnexo}
                        isDownloadingAnexo={isDownloadingAnexo}
                        onUploadClick={() => setShowModalUploadAnexo(true)}
                    />
                </div>
            </div>

            {/* Modais */}
            <EdicaoPacienteModal
                isOpen={showModalPedidoEdicao}
                onClose={() => setShowModalPedidoEdicao(false)}
                formData={formDataPaciente}
                isSaving={isSavingPaciente}
                onSave={handleUpdatePaciente}
                onUpdateField={handleUpdateField}
                onUpdateArrayField={handleUpdateArrayField}
                onAddArrayItem={handleAddArrayItem}
                onRemoveArrayItem={handleRemoveArrayItem}
                fieldErrors={fieldErrorsPaciente}
            />

            <AnamneseModal
                isOpen={showModalAnamnese}
                onClose={() => setShowModalAnamnese(false)}
                data={anamneseData}
                isLoading={isLoadingAnamnese}
                isSaving={isSavingAnamnese}
                onSave={handleSaveAnamnese}
                onUpdateField={handleUpdateAnamneseField}
            />

            <SessaoModal
                isOpen={showModalSessao}
                onClose={() => setShowModalSessao(false)}
                sessaoEdicaoId={sessaoEdicaoId}
                formSessaoData={formSessaoData}
                setFormSessaoData={setFormSessaoData}
                formSessaoConteudo={formSessaoConteudo}
                setFormSessaoConteudo={setFormSessaoConteudo}
                isSaving={isSavingSessao}
                onSave={handleSaveSessao}
                fieldErrors={fieldErrorsSessao}
            />

            <ConfirmacaoExclusaoModal
                sessao={sessaoExcluir}
                onClose={() => setSessaoExcluir(null)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />

            <ConfirmacaoConclusaoModal
                sessao={sessaoConcluir}
                onClose={() => setSessaoConcluir(null)}
                onConfirm={handleFinishSession}
                isFinishing={isFinishingSessao}
            />

            <UploadAnexoModal
                isOpen={showModalUploadAnexo}
                onClose={() => setShowModalUploadAnexo(false)}
                file={uploadAnexoFile}
                setFile={setUploadAnexoFile}
                descricao={uploadAnexoDescricao}
                setDescricao={setUploadAnexoDescricao}
                isUploading={isUploadingAnexo}
                onUpload={handleUploadAnexo}
            />

            <DocVisualizarModal
                documento={documentoVisualizar}
                onClose={() => setDocumentoVisualizar(null)}
                onDownload={handleDownloadDocumento}
                isDownloading={isDownloadingDoc !== null}
            />

            {/* Modal de visualização de relato simplificado */}
            {sessaoVisualizar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSessaoVisualizar(null)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-3xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
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
                                    onClick={() => handleDownload(sessaoVisualizar)}
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
                                >
                                    <Plus className="w-5 h-5 rotate-45" />
                                </button>
                            </div>
                        </div>
                        <div className="overflow-y-auto flex-1 px-6 py-5">
                            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: sessaoVisualizar.conteudo }} />
                        </div>
                    </div>
                </div>
            )}

            <Toast notification={notification} onClose={closeNotification} />
        </div>
    );
}
