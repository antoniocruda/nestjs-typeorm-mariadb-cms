import * as fs from 'fs';
import { toCamelCase } from './../helpers';
import { TableProps } from './../run';

const baseDir = './src/core';

function nestJsImports(tableProps: TableProps[]) {
    const imports = ['Controller', 'Param', 'Post', 'Put', 'Delete', 'Get'];

    const primaryField = tableProps.find(prop => (prop.Key.toLowerCase() === 'pri'));
    const primaryFieldType = (primaryField && primaryField.Type.startsWith('varchar')) ? 'string' : 'number';

    if (primaryFieldType === 'number') {
        imports.push('ParseIntPipe');
    }
    else {
        imports.push('ParseUUIDPipe');
    }

    return imports.join(",\n    ");
}

function controllerClassTemplate(
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

    return `import {
    ${nestJsImports(tableProps)}
} from '@nestjs/common';
import { ${className}Repository } from '@common/repos/${entityFileName}.repository';
import { ${className}Service } from './../services/${entityFileName}.service';
import { CreateDto } from './../dto/${folderName}/create.dto';
import { UpdateDto } from './../dto/${folderName}/update.dto';

@Controller('${folderName}')
export class ${className}Controller {

    constructor(
        private readonly repo: ${className}Repository,
        private readonly service: ${className}Service
    ) {}

    @Post('create')
    create(
        @Body() dto: CreateDto
    ) {
        return this.service.create(dto);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: ${primaryFieldType},
        @Body() dto: UpdateDto
    ) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    delete(
        @Param('id', ParseIntPipe) id: ${primaryFieldType}
    ) {
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

export default function controllerGenerator(
    tableProps: TableProps[],
    tableName: string,
    namespace: string
) {
    let folderName = tableName.replaceAll('_', '-');
    folderName = folderName.substring(0, folderName.length - 1);
    const folderPath = `${baseDir}/${namespace}/controllers`;

    let classFileName = tableName.replaceAll('_', '-');
    classFileName = classFileName.substring(0, classFileName.length - 1);
    let className = toCamelCase(tableName);
    className = className.substring(0, 1).toUpperCase() + className.substring(1, className.length - 1);

    try {
        fs.writeFileSync(`${folderPath}/${classFileName}.controller.ts`, controllerClassTemplate(className, tableName, tableProps));
    }
    catch (err) {
        console.error(err);
    }
}
