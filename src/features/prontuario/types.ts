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
    id_template: number | null;
    nome: string;
    status: 'RASCUNHO' | 'FINALIZADO' | 'EM_ASSINATURA' | 'ASSINADO' | 'RECUSADO' | 'CANCELADO' | 'FALHA';
    caminho_arquivo: string | null;
    data_criacao: string;
    data_atualizacao: string;
    data_finalizacao: string | null;
    conteudo: string;
    assinaturas: {
        id_pessoa: number;
        tipo_assinatura: string;
        status: string;
    }[];
}

export interface TipoDocumento {
    id_tipo_documento: number;
    nome: string;
    descricao: string;
    requer_assinatura_psicologo: boolean;
    requer_assinatura_paciente: boolean;
    id_template: number;
    versao_template: number;
}

export interface VariavelDocumento {
    nome_variavel: string;
    texto_exibido_usuario: string;
    tipo_input: 'text' | 'textarea' | 'date' | 'select';
    obrigatorio: boolean;
    origem: 'MANUAL' | 'CARREGADO_BD' | 'GERADO_IA';
}

export interface PreviewDocumento {
    id_tipo_documento: number;
    id_template: number;
    versao_template: number;
    conteudo: string;
    preview_token: string;
}

export interface DocumentoApiError {
    erro: string;
    detalhes?: string;
}

export interface AssinaturaDocumentoResponse {
    document_key: string;
    status: string;
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
