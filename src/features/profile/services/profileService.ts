import api from '@shared/api/apiClient';
import type { ProfileEditPayload, AlterarSenhaPayload } from '../types';

export const profileService = {
    async getProfile() {
        const response = await api.get('/psicologo/me');
        return response.data;
    },

    async updateProfile(payload: ProfileEditPayload) {
        const response = await api.put('/psicologo/me/editar', payload);
        return response.data;
    },

    async alterarSenha(payload: AlterarSenhaPayload) {
        const response = await api.put('/alterar-senha', payload);
        return response.data;
    }
};
