import api from '@shared/api/apiClient';
import type {
    HomeAdmResponse,
    UsuarioAdmin,
    UpdateUsuarioRequest,
    PerfilResponse,
    CriarPerfilRequest,
    CriarPerfilResponse,
    PsicologoCreatePayload
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
    }
};
