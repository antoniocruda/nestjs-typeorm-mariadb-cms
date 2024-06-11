import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ([
    {
        namespace: process.env.REDIS_NAMESPACE || 'default',
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || ''
    }
]));