export interface PsicologoResumo {
    nome: string;
    num_pacientes: number;
}

export interface HomeAdmResponse {
    num_psicologos: number;
    num_pacientes: number;
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
