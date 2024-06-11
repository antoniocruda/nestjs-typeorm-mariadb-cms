import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as dotenv from 'dotenv';

dotenv.config();

const options: DataSourceOptions & SeederOptions = {
    type: "mariadb",
    host: process.env.DB_HOST,
    port: (process.env.DB_PORT) ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ["src/common/entities/**/*.entity{.ts,.js}"],
    migrationsTableName: "migrations",
    migrations: ["database/migration/**/*.ts"],
    namingStrategy: new SnakeNamingStrategy(),
    seeds: ['database/seeds/**/*.ts'],
    factories: ['database/factories/**/*.ts']
};

const db1DataSource = new DataSource(options);

export default db1DataSource;