import * as path from 'path';
import * as mysql from 'mysql2';
import controllerGenerator from './code-gen-helpers/controller-generator';
import dtoGenerator from './code-gen-helpers/dto-generator';
import * as dotenv from 'dotenv';
import entityGenerator from './code-gen-helpers/entity-generator';
import repositoryGenerator from './code-gen-helpers/repository-generator';
import serviceGenerator from './code-gen-helpers/service-generator';

export type TableProps = {
    Field: string;
    Type: string;
    Null: string;
    Key: string;
    Default: string | null;
    Extra: string;
}

export type TablePropsType = 'string' | 'object' | 'array' | 'number' | 'boolean' | 'date';

dotenv.config();

if (process.argv.length < 3) {
    console.log("Usage: $ yarn code-gen <table-name> <namespace> <action>");
    process.exit(1);
}

const tableName = process.argv[2] as string;
const namespace = (process.argv.length >= 4) ? process.argv[3] as string : undefined;
const action = (process.argv.length >= 5) ? process.argv[4] as string : undefined;

async function main(): Promise<void> {
    const con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    return new Promise((resolve, reject) => {
        con.connect(function(err) {
            if (err) {
                reject(err);
                return;
            }

            const sql = `DESCRIBE ${tableName}`;

            con.query(sql, async function (err, result) {
                if (err) {
                    reject(err);
                    return;
                }

                try {
                    if (action) {
                        switch (action) {
                            // case 'frontend-api': 
                            //     await serviceGenerator((result as unknown) as TableProps[], tableName, namespace);
                            //     break;
                            // case 'service': 
                            //     await serviceGenerator((result as unknown) as TableProps[], tableName, namespace);
                            //     break;
                            case 'entity': 
                                await entityGenerator((result as unknown) as TableProps[], tableName);
                                break;
                            case 'repository': 
                                await repositoryGenerator(tableName);
                                break;
                            // case 'dto': 
                            //     await dtoGenerator((result as unknown) as TableProps[], tableName, namespace);
                            //     break;
                        }
                    }
                    else {
                        await entityGenerator((result as unknown) as TableProps[], tableName);
                        await repositoryGenerator(tableName);
                        // await dtoGenerator((result as unknown) as TableProps[], tableName, namespace);
                        // await serviceGenerator((result as unknown) as TableProps[], tableName, namespace);
                        // await controllerGenerator((result as unknown) as TableProps[], tableName, namespace);
                    }
    
                    resolve();
                }
                catch (ex) {
                    reject(ex);
                }
                finally {
                    con.destroy();
                }
            });
        });
    });
}

main()
    .then(() => {
        console.log('Code generation ended');
    });