export interface AuthUser {
    nome: string;
    perfis: {
        Perfil: string;
        descricao: string;
    }[];
}

export type LoginResponse = AuthUser;

export interface LoginCredentials {
    username: string;
    password: string;
}
