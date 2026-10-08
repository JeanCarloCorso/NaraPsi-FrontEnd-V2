import api from '@shared/api/apiClient';
import type {
    HomeAdmResponse,
    UsuarioAdmin,
    UpdateUsuarioRequest,
    PerfilResponse,
    CriarPerfilRequest,
    CriarPerfilResponse,
    PsicologoCreatePayload,
    TemplateDocumentoAdmin,
    TipoDocumentoAdmin,
    TipoDocumentoPayload,
    VariavelTemplateAdmin,
    VariavelTemplatePayload
} from '../types';

export const adminService = {
    async getHomeAdm(): Promise<HomeAdmResponse> {
        const response = await api.get(`${import.meta.env.VITE_API_URL}/home-adm`);
        return response.data;
    },

    async getUsuarios(): Promise<UsuarioAdmin[]> {
        const response = await api.get(`${import.meta.env.VITE_API_URL}/usuarios`);
        return response.data;
    },

    async atualizarUsuario(id_usuario: number, payload: UpdateUsuarioRequest): Promise<{ mensagem: string }> {
        const response = await api.put(`${import.meta.env.VITE_API_URL}/usuarios/${id_usuario}`, payload);
        return response.data;
    },

    async getPerfis(): Promise<PerfilResponse[]> {
        const response = await api.get(`${import.meta.env.VITE_API_URL}/perfis`);
        return response.data;
    },

    async criarPerfil(payload: CriarPerfilRequest): Promise<CriarPerfilResponse> {
        const response = await api.post(`${import.meta.env.VITE_API_URL}/perfis`, payload);
        return response.data;
    },

    async criarPsicologo(payload: PsicologoCreatePayload): Promise<{ mensagem: string }> {
        const response = await api.post(`${import.meta.env.VITE_API_URL}/psicologo-create`, payload);
        return response.data;
    },

    async getTiposDocumentosAdmin(): Promise<TipoDocumentoAdmin[]> {
        return (await api.get('/admin/documentos/tipos')).data;
    },
    async criarTipoDocumento(payload: TipoDocumentoPayload): Promise<TipoDocumentoAdmin> {
        return (await api.post('/admin/documentos/tipos', payload)).data;
    },
    async atualizarTipoDocumento(id: number, payload: TipoDocumentoPayload): Promise<TipoDocumentoAdmin> {
        return (await api.put(`/admin/documentos/tipos/${id}`, payload)).data;
    },
    async alterarStatusTipoDocumento(id: number, ativo: boolean): Promise<TipoDocumentoAdmin> {
        return (await api.patch(`/admin/documentos/tipos/${id}/status`, { ativo })).data;
    },
    async getTemplatesAdmin(): Promise<TemplateDocumentoAdmin[]> {
        return (await api.get('/admin/documentos/templates')).data;
    },
    async criarTemplate(idTipo: number, modelo: string): Promise<TemplateDocumentoAdmin> {
        return (await api.post('/admin/documentos/templates', { id_tipo_documento: idTipo, modelo })).data;
    },
    async atualizarTemplate(id: number, modelo: string): Promise<TemplateDocumentoAdmin> {
        return (await api.put(`/admin/documentos/templates/${id}`, { modelo })).data;
    },
    async publicarTemplate(id: number): Promise<TemplateDocumentoAdmin> {
        return (await api.post(`/admin/documentos/templates/${id}/publicar`)).data;
    },
    async inativarTemplate(id: number): Promise<TemplateDocumentoAdmin> {
        return (await api.post(`/admin/documentos/templates/${id}/inativar`)).data;
    },
    async getVariaveisTemplate(): Promise<VariavelTemplateAdmin[]> {
        return (await api.get('/admin/documentos/variaveis')).data;
    },
    async criarVariavelTemplate(payload: VariavelTemplatePayload): Promise<VariavelTemplateAdmin> {
        return (await api.post('/admin/documentos/variaveis', payload)).data;
    },
    async atualizarVariavelTemplate(id: number, payload: VariavelTemplatePayload): Promise<VariavelTemplateAdmin> {
        return (await api.put(`/admin/documentos/variaveis/${id}`, payload)).data;
    },
    async excluirVariavelTemplate(id: number): Promise<void> {
        await api.delete(`/admin/documentos/variaveis/${id}`);
    }
};
