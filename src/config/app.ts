import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    adminUserPasswordSaltRounds: 10,
    adminJwtSecret: process.env.ADMIN_JWT_SECRET || '',
    adminUserAuthRefreshTokenSecret: process.env.ADMIN_USER_AUTH_REFRESH_TOKEN_SECRET || '',
}));