import { TableProps } from './run';

export function toCamelCase(str: string) {
    return str.toLowerCase().replace(/[-_][a-z]/g, (group) => group.slice(-1).toUpperCase());
}

export function toSnakeCase(str: string) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

export function toKebabCase(str: string) {
    return str.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`).replace(/^-/, '');
}

export function replaceAll(str: string, search: string, replacement: string) {
    return str.split(search).join(replacement);
}

export function getType(tableProp: TableProps) {
    if (tableProp.Type.startsWith('int')) {
        return 'number';
    }
    else if (tableProp.Type.startsWith('tinyint(1)')) {
        return 'boolean';
    }
    else if (tableProp.Type.startsWith('timestamp') || tableProp.Type.startsWith('date')) {
        return 'date';
    }
    else if (tableProp.Type.startsWith('longtext')) {
        if (tableProp.Default === "'{}'") {
            return 'object';
        }
        else {
            return 'array';
        }
    }

    return 'string';
}
