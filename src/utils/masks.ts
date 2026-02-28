export const maskCPF = (value: string) => {
    if (!value) return "";
    return value
        .replace(/\D/g, '') // Remove tudo o que não é dígito
        .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos
        .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos de novo
        .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Coloca um hífen entre o terceiro e o quarto dígitos
        .replace(/(-\d{2})\d+?$/, '$1'); // Limita a 11 dígitos (+ pontuação)
};

export const maskRG = (value: string) => {
    if (!value) return "";
    const cleanValue = value.replace(/\D/g, '');

    // Se for maior que 9 dígitos, assume formato de CPF
    if (cleanValue.length > 9) {
        return maskCPF(value);
    }

    return cleanValue
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{1})\d+?$/, '$1');
};

export const maskCEP = (value: string) => {
    if (!value) return "";
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1');
};

export const maskPhone = (value: string) => {
    if (!value) return "";
    const rawValue = value.replace(/\D/g, '');

    // 0800
    if (rawValue.indexOf('0800') === 0) {
        return rawValue
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(\d{4})-(\d{3})(\d)/, '$1-$2$3')
            .replace(/(-\d{4})\d+?$/, '$1');
    }

    // Fixo (10 numbers) vs Celular (11 numbers)
    if (rawValue.length <= 10) {
        return rawValue
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    }

    return rawValue
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
};

export const cleanDigits = (value: string) => {
    if (typeof value !== 'string') return "";
    return value.replace(/\D/g, '');
};
