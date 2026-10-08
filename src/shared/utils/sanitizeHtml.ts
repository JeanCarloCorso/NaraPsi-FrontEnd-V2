import DOMPurify from 'dompurify';

const SAFE_STYLE_PROPERTIES = new Set([
    'background', 'background-color',
    'border', 'border-top', 'border-right', 'border-bottom', 'border-left',
    'border-color', 'border-style', 'border-width', 'border-collapse',
    'break-after', 'break-before', 'break-inside',
    'color', 'display',
    'font-family', 'font-size', 'font-style', 'font-weight',
    'height', 'line-height', 'list-style-type',
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'max-width', 'min-height',
    'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'page-break-after', 'page-break-before', 'page-break-inside',
    'text-align', 'text-decoration', 'text-indent',
    'vertical-align', 'white-space', 'width',
]);

const UNSAFE_STYLE_VALUE = /(?:url\s*\(|expression\s*\(|javascript\s*:|@import|behavior\s*:|-moz-binding)/i;

function filterInlineStyles(html: string): string {
    const parsed = new DOMParser().parseFromString(`<div id="sanitized-content">${html}</div>`, 'text/html');
    const root = parsed.getElementById('sanitized-content');

    if (!root) return '';

    root.querySelectorAll<HTMLElement>('[style]').forEach(element => {
        const safeDeclarations: string[] = [];

        for (let index = 0; index < element.style.length; index += 1) {
            const property = element.style.item(index).toLowerCase();
            const value = element.style.getPropertyValue(property).trim();

            if (SAFE_STYLE_PROPERTIES.has(property) && value && !UNSAFE_STYLE_VALUE.test(value)) {
                safeDeclarations.push(`${property}: ${value}`);
            }
        }

        if (safeDeclarations.length > 0) {
            element.setAttribute('style', safeDeclarations.join('; '));
        } else {
            element.removeAttribute('style');
        }
    });

    return root.innerHTML;
}

export function sanitizeHtml(html: string): string {
    const sanitized = DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    });

    return filterInlineStyles(sanitized);
}
