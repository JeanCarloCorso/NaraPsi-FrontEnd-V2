import api from '../../../services/api';
import type { Anamnese, Documento, Anexo, Sessao, PacienteFormData } from '../types';

export const prontuarioService = {
    // Paciente
    getPaciente: (id: string) => api.get(`/pacientes/${id}`),
    getTodosPacientes: () => api.get('/pacientes'),
    updatePaciente: (id: string, data: PacienteFormData) => api.put(`/paciente/${id}/editar`, data),

    // Anamnese
    getAnamnese: (id: string) => api.get(`/pacientes/${id}/anamnese`),
    saveAnamnese: (id: string, data: Anamnese) => api.post(`/pacientes/${id}/anamnese`, data),

    // Sessões
    getSessoes: (id: string) => api.get(`/pacientes/${id}/sessoes`),
    createSessao: (id: string, data: any) => api.post(`/pacientes/${id}/sessoes`, data),
    updateSessao: (id: string, sessaoId: number, data: any) => api.put(`/pacientes/${id}/sessoes/${sessaoId}`, data),
    deleteSessao: (id: string, sessaoId: number) => api.delete(`/pacientes/${id}/sessoes/${sessaoId}`),
    concluirSessao: (id: string, sessaoId: number) => api.patch(`/pacientes/${id}/sessoes/${sessaoId}/concluir`),
    downloadSessao: (id: string, sessaoId: number) => api.get(`/pacientes/${id}/sessoes/${sessaoId}/download`, { responseType: 'blob' }),

    // Documentos
    getDocumentos: (id: string) => api.get(`/paciente/${id}/documentos`),
    downloadDocumento: (docId: number) => api.get(`/documento/${docId}/download`, { responseType: 'blob' }),

    // Anexos
    getAnexos: (id: string) => api.get(`/paciente/${id}/anexos`),
    uploadAnexo: (id: string, formData: FormData) => api.post(`/paciente/${id}/upload-anexo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    downloadAnexo: (anexoId: number) => api.get(`/anexo/${anexoId}/download-anexo`, { responseType: 'blob' }),
};
