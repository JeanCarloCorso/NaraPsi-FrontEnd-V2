export interface LoginResponse {
    access_token: string;
    token_type: string;
    nome: string;
    perfis: {
        Perfil: string;
        descricao: string;
    }[];
}

export interface LoginCredentials {
    username: string;
    password: string;
}
