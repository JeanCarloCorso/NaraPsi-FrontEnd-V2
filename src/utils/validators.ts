/**
 * Utilitários de Validação e Sanitização de Dados
 */

/**
 * Valida o formato de um e-mail através de Regex
 */
export const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim().toLowerCase());
};

/**
 * Valida CPF (Algoritmo de validação)
 */
export const isValidCPF = (cpf: string): boolean => {
    const rawCpf = cpf.replace(/\D/g, '');

    if (rawCpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(rawCpf)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
        sum = sum + parseInt(rawCpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(rawCpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum = sum + parseInt(rawCpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(rawCpf.substring(10, 11))) return false;

    return true;
};

/**
 * Valida se uma data é válida e não futura
 */
export const isValidDate = (date: string): boolean => {
    if (!date) return true; // Se opcional

    const selectedDate = new Date(date + "T12:00:00");
    const now = new Date();

    // Verifica se é uma data válida
    if (isNaN(selectedDate.getTime())) return false;

    // Impede datas futuras
    if (selectedDate > now) return false;

    // Impede datas extremamente antigas (ex: antes de 1900)
    if (selectedDate.getFullYear() < 1900) return false;

    return true;
};

/**
 * Sanitiza strings: remove espaços extras e caracteres suspeitos
 */
export const sanitizeText = (text: string): string => {
    if (!text) return '';
    return text
        .trim()
        .replace(/\s{2,}/g, ' ') // Remove espaços duplos
        .replace(/[<>]/g, ''); // Remove < e > rudimentar contra XSS simple
};

/**
 * Formata e-mail para lowercase e trim
 */
export const formatEmail = (email: string): string => {
    return email.trim().toLowerCase();
};
