export interface Paciente {
    id: number;
    nome: string;
    sexo: string;
    idade: number;
    ultima_data_sessao: string | null;
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

export interface Familiar {
    nome: string;
    parentesco: string;
    profissao: string;
    telefone: string;
}

export interface PacienteFormData {
    nome: string;
    cpf: string;
    rg: string;
    email: string;
    data_nascimento: string;
    sexo: string;
    telefones: Telefone[];
    enderecos: Endereco[];
    familiares: Familiar[];
    anotacoes: string;
}
