const escapeXml = (value: string): string => {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&apos;');
};

const toXmlNode = (key: string, value: unknown): string => {
    if (value === null || value === undefined) {
        return `<${key} />`;
    }

    if (Array.isArray(value)) {
        return value.map((item) => toXmlNode(key, item)).join('');
    }

    if (typeof value === 'object') {
        const entries = Object.entries(value as Record<string, unknown>);

        if (entries.length === 0) {
            return `<${key} />`;
        }

        const children = entries
            .map(([childKey, childValue]) => toXmlNode(childKey, childValue))
            .join('');

        return `<${key}>${children}</${key}>`;
    }

    return `<${key}>${escapeXml(String(value))}</${key}>`;
};

export const jsonXmlConvertAction = async (
    payload: Record<string, unknown>,
    config: { rootName?: string; outputField?: string }
): Promise<Record<string, unknown>> => {
    const rootName =
        typeof config?.rootName === 'string' && config.rootName.trim().length > 0
            ? config.rootName.trim()
            : 'root';

    const outputField =
        typeof config?.outputField === 'string' && config.outputField.trim().length > 0
            ? config.outputField.trim()
            : 'xml';

    const xml = `<?xml version="1.0" encoding="UTF-8"?>${toXmlNode(rootName, payload)}`;

    return {
        [outputField]: xml,
    };
};
