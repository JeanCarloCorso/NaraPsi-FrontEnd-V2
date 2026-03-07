import api from '@shared/api/apiClient';
import type { Paciente, PacienteFormData } from '../types';

export const pacientesService = {
    async listarPacientes(): Promise<Paciente[]> {
        const response = await api.get<Paciente[]>('/pacientes');
        return response.data;
    },

    async criarPaciente(data: PacienteFormData): Promise<void> {
        await api.post('/pacientes', data);
    }
};
