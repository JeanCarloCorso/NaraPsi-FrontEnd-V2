export interface Familiar {
    nome: string;
    parentesco: string;
    profissao: string;
    telefone: string;
}

export interface Telefone {
    numero: string;
    descricao: string;
}

export interface Endereco {
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

export interface PacienteDetalhe {
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

export interface Anexo {
    id_anexo: number;
    id_paciente: number;
    descricao: string;
    nome_arquivo: string;
    extensao: string;
    tamanho_bytes: number;
    data_envio: string;
}

export interface Documento {
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

export interface Anamnese {
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

export interface PacienteFormData {
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

export interface NotificationState {
    message: string;
    type: 'success' | 'error';
    visible: boolean;
}

export interface Sessao {
    id_sessao: number;
    conteudo: string;
    data_sessao: string;
    situacao: 'EDITANDO' | 'CONCLUIDO';
}
