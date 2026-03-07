export interface Aniversariante {
    nome: string;
    idade: number;
    telefone: string | null;
}

export interface HomeData {
    total_pacientes_masculino: number;
    total_pacientes_feminino: number;
    aniversariantes_do_dia: Aniversariante[];
}
