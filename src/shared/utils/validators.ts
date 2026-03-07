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

/**
 * Formata CPF
 */
export const formatCPF = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
};

/**
 * Formata RG
 */
export const formatRG = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
        .slice(0, 12);
};

/**
 * Valida RG
 */
export const isValidRG = (rg: string): boolean => {
    if (!rg) return true; // se opcional
    return rg.replace(/\D/g, '').length >= 7;
};

/**
 * Formata CRP
 */
export const formatCRP = (value: string) => {
    const cleaned = value.replace(/[^0-9a-zA-Z]/g, ''); // Permite números e letras 
    return cleaned.replace(/^(\d{2})(.+)/, '$1/$2').slice(0, 10);
};

/**
 * Valida CRP
 */
export const isValidCRP = (crp: string): boolean => {
    const cleaned = crp.replace(/[^0-9a-zA-Z]/g, '');
    return cleaned.length >= 6;
};

/**
 * Formata Telefone
 */
export const formatTelefone = (value: string) => {
    const nums = value.replace(/\D/g, '');
    if (nums.length <= 10) {
        return nums.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
    return nums.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').slice(0, 15).replace(/-$/, '');
};

/**
 * Formata CEP
 */
export const formatCEP = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 9);
};
