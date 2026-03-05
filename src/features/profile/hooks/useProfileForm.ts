import { useState, useEffect } from 'react';
import { maskCPF, maskRG, maskCEP, maskPhone, cleanDigits } from '@shared/utils/masks';
import { isValidEmail, isValidCPF, isValidDate, sanitizeText, formatEmail } from '@shared/utils/validators';
import { profileService } from '../services/profileService';
import type { ProfileEditPayload } from '../types';

interface NotificationState {
    type: 'success' | 'error' | 'info';
    text: string;
}

export function useProfileForm() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<NotificationState | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<ProfileEditPayload>({
        nome: '',
        cpf: '',
        rg: '',
        email: '',
        data_nascimento: '',
        sexo: '',
        crp: '',
        especialidade: '',
        telefones: [{ numero: '', descricao: '' }],
        enderecos: [{
            cep: '', endereco: '', numero: '', complemento: '',
            bairro: '', cidade: '', estado: '', pais: 'Brasil', descricao: 'Principal'
        }]
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await profileService.getProfile();
                const pessoa = data.pessoa || {};
                const psicologo = data.psicologo || {};

                let telefones = data.telefones && data.telefones.length > 0 ? data.telefones : [{ numero: '', descricao: '' }];
                let enderecos = data.enderecos && data.enderecos.length > 0 ? data.enderecos : [{
                    cep: '', endereco: '', numero: '', complemento: '',
                    bairro: '', cidade: '', estado: '', pais: 'Brasil', descricao: ''
                }];

                telefones = telefones.map((t: any) => ({ ...t, numero: maskPhone(t.numero) }));
                enderecos = enderecos.map((e: any) => ({ ...e, cep: maskCEP(e.cep) }));

                const birthDate = pessoa.data_nascimento?.split(' ')[0] || '';

                setFormData({
                    nome: pessoa.nome || '',
                    cpf: pessoa.cpf ? maskCPF(pessoa.cpf) : '',
                    rg: pessoa.rg ? maskRG(pessoa.rg) : '',
                    email: pessoa.email || '',
                    data_nascimento: birthDate,
                    sexo: pessoa.sexo || '',
                    crp: psicologo.crp || '',
                    especialidade: psicologo.especialidade || '',
                    telefones,
                    enderecos
                });
            } catch (err: any) {
                setMessage({ type: 'error', text: 'Erro ao carregar os dados do perfil.' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleFieldChange = (field: keyof ProfileEditPayload, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleTelefoneChange = (index: number, field: string, value: string) => {
        const parsedValue = field === 'numero' ? maskPhone(value) : value;
        const newTelefones = [...formData.telefones];
        newTelefones[index] = { ...newTelefones[index], [field]: parsedValue };
        setFormData(prev => ({ ...prev, telefones: newTelefones }));
    };

    const addTelefone = () => {
        setFormData(prev => ({
            ...prev,
            telefones: [...prev.telefones, { numero: '', descricao: '' }]
        }));
    };

    const removeTelefone = (index: number) => {
        setFormData(prev => ({
            ...prev,
            telefones: prev.telefones.filter((_, i) => i !== index)
        }));
    };

    const handleEnderecoChange = async (index: number, field: string, value: string | number) => {
        const finalValue = field === 'cep' ? maskCEP(value as string) : value;

        setFormData(prev => {
            const newEnderecos = [...prev.enderecos];
            newEnderecos[index] = { ...newEnderecos[index], [field]: finalValue };
            return { ...prev, enderecos: newEnderecos };
        });

        if (field === 'cep') {
            const cleanCep = cleanDigits(value as string);
            if (cleanCep.length === 8) {
                try {
                    const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                    const viaCepData = await viaCepResponse.json();

                    if (!viaCepData.erro) {
                        setFormData(prev => {
                            const newEnds = [...prev.enderecos];
                            newEnds[index] = {
                                ...newEnds[index],
                                endereco: viaCepData.logradouro || newEnds[index].endereco,
                                bairro: viaCepData.bairro || newEnds[index].bairro,
                                cidade: viaCepData.localidade || newEnds[index].cidade,
                                estado: viaCepData.uf || newEnds[index].estado,
                            };
                            return { ...prev, enderecos: newEnds };
                        });
                        setMessage({ type: 'info', text: 'Endereço autocompletado do ViaCEP.' });
                    }
                } catch (err) {
                    console.error('Erro ao buscar CEP', err);
                }
            }
        }
    };

    const addEndereco = () => {
        setFormData(prev => ({
            ...prev,
            enderecos: [...prev.enderecos, {
                cep: '', endereco: '', numero: '', complemento: '',
                bairro: '', cidade: '', estado: '', pais: 'Brasil', descricao: ''
            }]
        }));
    };

    const removeEndereco = (index: number) => {
        setFormData(prev => ({
            ...prev,
            enderecos: prev.enderecos.filter((_, i) => i !== index)
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';

        if (formData.email && !isValidEmail(formData.email)) {
            newErrors.email = 'E-mail inválido';
        } else if (!formData.email) {
            newErrors.email = 'E-mail é obrigatório';
        }

        if (formData.cpf && !isValidCPF(formData.cpf)) {
            newErrors.cpf = 'CPF inválido';
        }

        if (!formData.data_nascimento) {
            newErrors.data_nascimento = 'Data de nascimento é obrigatória';
        } else if (!isValidDate(formData.data_nascimento)) {
            newErrors.data_nascimento = 'Data inválida ou futura';
        }

        formData.telefones.forEach((tel, idx) => {
            const cleanTel = cleanDigits(tel.numero);
            if (tel.numero && (cleanTel.length < 10 || cleanTel.length > 11)) {
                newErrors[`telefone_${idx}`] = 'Telefone incompleto';
            }
        });

        formData.enderecos.forEach((end, idx) => {
            if (end.cep && cleanDigits(end.cep).length !== 8) {
                newErrors[`cep_${idx}`] = 'CEP incompleto';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            setMessage({ type: 'error', text: 'Por favor, corrija os erros no formulário.' });
            return;
        }

        setIsSaving(true);
        setMessage(null);

        try {
            const payload = {
                ...formData,
                nome: sanitizeText(formData.nome),
                email: formatEmail(formData.email),
                cpf: cleanDigits(formData.cpf),
                rg: cleanDigits(formData.rg),
                crp: sanitizeText(formData.crp),
                especialidade: sanitizeText(formData.especialidade),
                enderecos: formData.enderecos.map(end => ({
                    ...end,
                    endereco: sanitizeText(end.endereco),
                    bairro: sanitizeText(end.bairro),
                    cidade: sanitizeText(end.cidade),
                    complemento: sanitizeText(end.complemento),
                    descricao: sanitizeText(end.descricao),
                    numero: Number(end.numero) || 0,
                    cep: cleanDigits(end.cep)
                })),
                telefones: formData.telefones.map(tel => ({
                    ...tel,
                    numero: cleanDigits(tel.numero),
                    descricao: sanitizeText(tel.descricao)
                }))
            };

            await profileService.updateProfile(payload);
            setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });

            if (formData.nome) localStorage.setItem('nome', formData.nome);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Erro ao salvar perfil.' });
        } finally {
            setIsSaving(false);
        }
    };

    return {
        isLoading,
        isSaving,
        message,
        errors,
        formData,
        handleFieldChange,
        handleTelefoneChange,
        addTelefone,
        removeTelefone,
        handleEnderecoChange,
        addEndereco,
        removeEndereco,
        handleSaveProfile
    };
}
