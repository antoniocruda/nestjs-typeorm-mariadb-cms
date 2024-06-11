import * as fs from 'fs';
import { toCamelCase } from '../helpers';
import { TableProps } from 'tools/code-gen';

const baseDir = './src/core';

function serviceClassTemplate(
    className: string,
    tableName: string,
    tableProps: TableProps[]
) {
    let entityFileName = tableName.replaceAll('_', '-');
    entityFileName = entityFileName.substring(0, entityFileName.length - 1);

    let folderName = tableName.replaceAll('_', '-');
    folderName = folderName.substring(0, folderName.length - 1);

    let tableReadableName = tableName.replaceAll('_', ' ');

    const primaryField = tableProps.find(prop => (prop.Key.toLowerCase() === 'pri'));
    const primaryFieldType = (primaryField && primaryField.Type.startsWith('varchar')) ? 'string' : 'number';

    return `import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { fillUpObjectWithDtoValues } from '@common/helpers/dto';
import { ${className} } from '@common/entities/${entityFileName}.entity';
import { ${className}Repository } from '@common/repos/${entityFileName}.repository';
import { CreateDto } from './../dto/${folderName}/create.dto';
import { UpdateDto } from './../dto/${folderName}/update.dto';

@Injectable()
export class ${className}Service {

    constructor(
        private readonly repo: ${className}Repository
    ) {}

    async create(dto: CreateDto) {
        const obj = new ${className}();

        fillUpObjectWithDtoValues<${className}>(obj, dto);
        
        return this.repo.save(obj);
    }

    async update(id: ${primaryFieldType}, dto: UpdateDto) {
        const obj = await this.repo.findOneBy({
            id
        });
        if (!obj) {
            throw new NotFoundException('${tableReadableName} not found.');
        }
        
        fillUpObjectWithDtoValues<${className}>(obj, dto);
        
        return this.repo.save(obj);
    }

    async delete(id: ${primaryFieldType}) {
        const obj = await this.repo.findOneBy({
            id
        });
        if (!obj) {
            throw new NotFoundException('${tableReadableName} not found.');
        }

        return this.repo.delete(id);
    }

}
`;
}

export default function serviceGenerator(
    tableProps: TableProps[],
    tableName: string,
    namespace: string
) {
    let folderName = tableName.replaceAll('_', '-');
    folderName = folderName.substring(0, folderName.length - 1);
    const folderPath = `${baseDir}/${namespace}/services`;

    let classFileName = tableName.replaceAll('_', '-');
    classFileName = classFileName.substring(0, classFileName.length - 1);
    let className = toCamelCase(tableName);
    className = className.substring(0, 1).toUpperCase() + className.substring(1, className.length - 1);

    try {
        fs.writeFileSync(`${folderPath}/${classFileName}.service.ts`, serviceClassTemplate(className, tableName, tableProps));
    }
    catch (err) {
        console.error(err);
    }
}
