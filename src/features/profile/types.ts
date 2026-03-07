export interface ProfileTelefone {
    numero: string;
    descricao: string;
}

export interface ProfileEndereco {
    cep: string;
    endereco: string;
    numero: number | string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    pais: string;
    descricao: string;
}

export interface ProfileEditPayload {
    nome: string;
    cpf: string;
    rg: string;
    email: string;
    data_nascimento: string;
    sexo: string;
    crp: string;
    especialidade: string;
    telefones: ProfileTelefone[];
    enderecos: ProfileEndereco[];
}

export interface AlterarSenhaPayload {
    senha_antiga: string;
    nova_senha: string;
}
