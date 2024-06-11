import * as fs from 'fs';
import { TableProps, TablePropsType } from '../run';
import { getType, toCamelCase } from './../helpers';

const baseDir = './src/common/entities';

function fieldEntryColumnType(tableProp: TableProps, type: TablePropsType) {
    if (tableProp.Key === 'PRI') {
        if (
            (
                tableProp.Type.startsWith('int')
                || tableProp.Type.startsWith('unsigned int')
            )
            && (tableProp.Extra.includes('auto_increment'))
        ) {
            return `@PrimaryGeneratedColumn('increment')`;
        }
        else {
            return `@PrimaryGeneratedColumn()`;
        }
    }
    else if (
        type === 'array'
        || type === 'object'
    ) {
        return `@Column('json')`;
    }
    else if (
        type === 'number'
        || type === 'boolean'
        || type === 'string'
    ) {
        return `@Column()`;
    }
    else if (type === 'date') {
        if (
            tableProp.Type.startsWith('timestamp')
            && tableProp.Field === 'created_at'
        ) {
            return `@CreateDateColumn({ type: 'timestamp' })`;
        }
        else if (
            tableProp.Type.startsWith('timestamp')
            && tableProp.Field === 'updated_at'
        ) {
            return `@UpdateDateColumn({ type: 'timestamp' })`;
        }
        
        return `@Column({ type: 'timestamp' })`;
    }
}

function fieldEntry(tableProp: TableProps) {
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
    ${fieldEntryColumnType(tableProp, type)}
    ${toCamelCase(tableProp.Field)}: ${trueType};
`;
}

function fieldEntries(tableProps: TableProps[]) {
    const entries = tableProps.map(tableProp => fieldEntry(tableProp));

    return entries.join('');
}

function typeOrmImports(tableProps: TableProps[]) {
    const imports = ['Entity', 'Column', 'PrimaryGeneratedColumn'];
    const idx = tableProps.findIndex(prop => (prop.Field === 'created_at' || prop.Field === 'updated_at'));
    
    if (idx >= 0) {
        imports.push('CreateDateColumn');
        imports.push('UpdateDateColumn');
    }

    return imports.join(",\n    ");
}

function entityClassTemplate(tableProps: TableProps[], className: string, tableName: string) {
    return `import {
    ${typeOrmImports(tableProps)}
} from 'typeorm';

@Entity({
    name: '${tableName}'
})
export class ${className} {
${fieldEntries(tableProps)}
}
`;
}

export default function entityGenerator(
    tableProps: TableProps[],
    tableName: string
) {
    let classFileName = tableName.replaceAll('_', '-');
    classFileName = classFileName.substring(0, classFileName.length - 1);
    let className = toCamelCase(tableName);
    className = className.substring(0, 1).toUpperCase() + className.substring(1, className.length - 1);

    try {
        fs.writeFileSync(`${baseDir}/${classFileName}.entity.ts`, entityClassTemplate(tableProps, className, tableName));
    }
    catch (err) {
        console.error(err);
    }
}