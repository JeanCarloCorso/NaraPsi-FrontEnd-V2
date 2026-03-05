import { useState, useEffect, useMemo, useCallback } from 'react';
import { pacientesService } from '../services/pacientesService';
import type { Paciente } from '../types';

export function usePacientesList() {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPacientes = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await pacientesService.listarPacientes();
            setPacientes(data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao carregar a lista de pacientes.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPacientes();
    }, [fetchPacientes]);

    const filteredPacientes = useMemo(() => {
        if (searchTerm.trim().length >= 3) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            return pacientes.filter(p =>
                p.nome.toLowerCase().includes(lowerCaseSearch) ||
                p.sexo.toLowerCase().includes(lowerCaseSearch)
            );
        }
        return pacientes;
    }, [pacientes, searchTerm]);

    return {
        pacientes,
        filteredPacientes,
        isLoading,
        error,
        searchTerm,
        setSearchTerm,
        fetchPacientes
    };
}
