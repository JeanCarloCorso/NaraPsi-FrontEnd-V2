export const maskCPF = (value: string) => {
    return value
        .replace(/\D/g, '') // Remove tudo o que não é dígito
        .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos
        .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos de novo (para o segundo bloco de números)
        .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Coloca um hífen entre o terceiro e o quarto dígitos
        .replace(/(-\d{2})\d+?$/, '$1'); // Captura 2 números seguidos de um traço e não deixa ser digitado mais nada
};

export const maskRG = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{1})\d+?$/, '$1');
};

export const maskCEP = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1');
};

export const maskPhone = (value: string) => {
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

export const cleanDigits = (value: string) => value.replace(/\D/g, '');
