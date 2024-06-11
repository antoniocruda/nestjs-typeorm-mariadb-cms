import * as fs from 'fs';
import { replaceAll, toCamelCase } from './../helpers';

const baseDir = './src/common/repos';

function repositoryClassTemplate(className: string, tableName: string) {
    let entityFileName = replaceAll(tableName, '_', '-');
    entityFileName = entityFileName.substring(0, entityFileName.length - 1);

    return `import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ${className} } from '../entities/${entityFileName}.entity';

@Injectable()
export class ${className}Repository extends Repository<${className}> {

    constructor(private readonly dataSource: DataSource) {
        super(${className}, dataSource.createEntityManager());
    }

}
`;
}

export default function repositoryGenerator(tableName: string) {
    let classFileName = replaceAll(tableName, '_', '-');
    classFileName = classFileName.substring(0, classFileName.length - 1);
    let className = toCamelCase(tableName);
    className = className.substring(0, 1).toUpperCase() + className.substring(1, className.length - 1);

    try {
        fs.writeFileSync(`${baseDir}/${classFileName}.repository.ts`, repositoryClassTemplate(className, tableName));
    }
    catch (err) {
        console.error(err);
    }
}
