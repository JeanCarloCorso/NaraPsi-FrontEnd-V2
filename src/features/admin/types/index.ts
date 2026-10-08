export interface PsicologoResumo {
    id_psicologo: number;
    nome: string;
    num_pacientes: number;
    num_pacientes_ativos: number;
    num_pacientes_inativos: number;
}

export interface HomeAdmResponse {
    num_psicologos: number;
    num_pacientes: number;
    num_pacientes_ativos: number;
    num_pacientes_inativos: number;
    psicologos: PsicologoResumo[];
}

export interface UsuarioAdmin {
    id_usuario: number;
    nome: string;
    sexo: string;
    login_ativo: boolean;
    data_criacao: string;
    ultimo_acesso: string;
    perfis: string[];
}

export interface UpdateUsuarioRequest {
    login_ativo: boolean;
    perfis: number[];
}

export interface CriarPerfilRequest {
    nome: string;
    descricao: string;
}

export interface CriarPerfilResponse {
    mensagem: string;
    id_perfil: number;
}

export interface PerfilResponse {
    id_perfil: number;
    nome: string;
    descricao: string;
}

export interface PsicologoTelefonePayload {
    numero: string;
    descricao: string;
}

export interface PsicologoEnderecoPayload {
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

export interface PsicologoCreatePayload {
    nome: string;
    cpf: string;
    rg: string;
    email: string;
    data_nascimento: string;
    sexo: string;
    crp: string;
    especialidade: string;
    senha?: string;
    telefones?: PsicologoTelefonePayload[];
    enderecos?: PsicologoEnderecoPayload[];
}

export interface TipoDocumentoAdmin {
    id_tipo_documento: number;
    nome: string;
    descricao: string | null;
    requer_assinatura_psicologo: boolean;
    requer_assinatura_paciente: boolean;
    ativo: boolean;
    quantidade_templates: number;
}

export type TipoDocumentoPayload = Omit<TipoDocumentoAdmin, 'id_tipo_documento' | 'quantidade_templates'>;

export interface TemplateDocumentoAdmin {
    id_templates: number;
    id_tipo_documento: number;
    tipo_documento: string;
    modelo: string;
    versao: number;
    status: 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO';
    data_criacao: string;
    data_publicacao: string | null;
    variaveis: string[];
    variaveis_nao_cadastradas?: string[];
}

export interface VariavelTemplateAdmin {
    id: number;
    nome_variavel: string;
    descricao: string;
    texto_exibido_usuario: string;
    origem_valor: 'MANUAL' | 'CARREGADO_BD' | 'GERADO_IA';
    referencia: 'PACIENTE' | 'PSICOLOGO' | 'SQL' | 'NULO';
    tabela_origem: string | null;
    coluna_origem: string | null;
    sql_consulta: string | null;
    dado_criptografado: boolean;
}

export type VariavelTemplatePayload = Omit<VariavelTemplateAdmin, 'id'>;
