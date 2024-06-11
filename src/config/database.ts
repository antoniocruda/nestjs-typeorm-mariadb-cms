import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {    
    const config:Record<string, unknown> = {
        type: process.env.DB_CONNECTION || 'mariadb',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'main_cms',
        entities: ['dist/**/*.entity{.ts,.js}']
    };

    return config;
});
