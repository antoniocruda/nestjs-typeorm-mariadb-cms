import * as fs from 'fs';
import { TableProps, TablePropsType } from '../run';
import { getType, toCamelCase } from './../helpers';

const baseDir = './src/core';

function dtoEntryJoie(tableProp: TableProps, type: TablePropsType) {
    if (type === 'array') {
        return `
        Joie.array()
            .items(

            )
            .required()`;
    }
    else if (type === 'object') {
        return `
        Joie.object()
            .keys({

            })
            .required()`;
    }
    else if (type === 'number') {
        return `
        Joie.number()
            .min(0)
            .max(999999)
            .required()`;
    }
    else if (type === 'boolean') {
        return `
        Joie.boolean()
            .required()`;
    }
    else if (type === 'date') {
        return `
        Joie.date()
            .required()`;
    }
    else {
        const numbers = tableProp.Type.match(/\((\d+)\)/);
        let maxLength = 0;
        if (numbers) {
            maxLength = parseInt(numbers[1]);
        }
        
        return `
        Joie.string()
            .max(${maxLength})
            .required()`;
    }
}

function dtoEntry(tableProp: TableProps) {
    const type = getType(tableProp);
    
    let trueType = type;
    if (type === 'object') {
        trueType = 'Record<string, string>';
    }
    else if (type === 'array') {
        trueType = 'string[]';
    }
    else if (type === 'date') {
        trueType = 'Date';
    }

    return `
    @JoiSchema(${dtoEntryJoie(tableProp, type)}
    )
    ${toCamelCase(tableProp.Field)}: ${trueType};
`;
}

function dtoEntries(tableProps: TableProps[]) {
    const entries = tableProps
        .filter(prop => (prop.Key === '' && !['created_at', 'updated_at', 'market', 'lang'].includes(prop.Field)))
        .map(tableProp => dtoEntry(tableProp));

    return entries.join('');
}

function createDtoTemplate(tableProps: TableProps[]) {
    return `import { JoiSchema, JoiSchemaOptions } from 'joi-class-decorators';
import Joie from '@common/lib/joi.extend';

@JoiSchemaOptions({
    allowUnknown: false
})
export class CreateDto {
${dtoEntries(tableProps)}
}
`;
}

function updateDtoTemplate(tableProps: TableProps[]) {
    return `import { JoiSchema, JoiSchemaOptions } from 'joi-class-decorators';
import Joie from '@common/lib/joi.extend';

@JoiSchemaOptions({
    allowUnknown: false
})
export class UpdateDto {
${dtoEntries(tableProps)}
}
`;
}

function searchTemplate() {
    return `import { JoiSchema, JoiSchemaOptions } from 'joi-class-decorators';
import Joie from '@common/lib/joi.extend';

@JoiSchemaOptions({
    allowUnknown: false
})
export class SearchDto {
    @JoiSchema(
        Joie.number()
            .optional()
            .min(5)
            .max(100)
    )
    entriesPerPage?: number;

    @JoiSchema(
        Joie.number()
            .optional()
            .min(1)
    )
    page?: number;

    @JoiSchema(
        Joie.string()
            .optional()
            .allow('')
    )
    keyword?: string;
}`;
}

export default async function dtoGenerator(
    tableProps: TableProps[],
    tableName: string,
    namespace: string
) {
    let folderName = tableName.replaceAll('_', '-');
    folderName = folderName.substring(0, folderName.length - 1);
    const folderPath = `${baseDir}/${namespace}/dto/${folderName}`;

    try {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        fs.writeFileSync(`${folderPath}/create.dto.ts`, createDtoTemplate(tableProps));
        fs.writeFileSync(`${folderPath}/update.dto.ts`, updateDtoTemplate(tableProps));
        fs.writeFileSync(`${folderPath}/search.dto.ts`, searchTemplate());
    }
    catch (err) {
        console.error(err);
    }
}