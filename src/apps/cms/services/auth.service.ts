import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { AdminUserRepository } from '@common/repos/admin-user.repository';
import { AdminUserWrongPasswordAttemptRepository } from '@common/repos/admin-user-wrong-password-attempt.repository';
import { AdminUserWrongPasswordAttempt } from '@common/entities/admin-user-wrong-password-attempt.entity';
import { AdminUser } from '@common/entities/admin-user.entity';
import { AdminUserRoleRepository } from '@common/repos/admin-user-role.repository';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { FailedException } from '@common/exceptions/failed.exception';
import { AccountInactiveException } from '@common/exceptions/account-inactive.exception';
import { AccountLockedException } from '@common/exceptions/account-locked.exception';
import { RefreshSessionDto } from '../dto/auth/refresh-session.dto';
import { LogoutDto } from '../dto/auth/logout.dto';
import { ChangePasswordDto } from '../dto/auth/change-password.dto';
import { LoginDto } from '../dto/auth/login.dto';

@Injectable()
export class AuthService {
    private static readonly REDIS_AUTH_REFRESH_TOKEN_KEY = 'admin_refresh_token:$refreshToken';
    private static readonly REDIS_AUTH_REFRESH_TOKEN_EXPIRATION = 7200; // 12 hours
    private static readonly MAX_LOGIN_ATTEMPTS = 3;

    constructor(
        @InjectRedis('default')
        private readonly redis: Redis,
        
        private readonly repo: AdminUserRepository,
        private readonly adminUserRoleRepo: AdminUserRoleRepository,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
        private readonly adminUserWrongPasswordAttemptRepo: AdminUserWrongPasswordAttemptRepository
    ) {}

    async login(dto: LoginDto) {
        const user = await this.repo.findOneBy({
            username: dto.username
        })
        if (!user) {
            throw new FailedException('Either your username or your password or both is incorrect.');
        }

        if (user.status === 'inactive') {
            throw new AccountInactiveException();
        }

        if (user.status === 'locked') {
            throw new AccountLockedException();
        }

        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            const attemptsModel = await this.adminUserWrongPasswordAttemptRepo.findOneBy({
                adminUserId: user.id
            });
            if (!attemptsModel) {
                const attempts = new AdminUserWrongPasswordAttempt();
                attempts.adminUserId = user.id;
                attempts.attempts = 1;
    
                await this.adminUserWrongPasswordAttemptRepo.save(attempts);
            }
            else if (attemptsModel.attempts === AuthService.MAX_LOGIN_ATTEMPTS) {
                user.status = 'locked';
    
                await this.repo.save(user);
                await this.adminUserWrongPasswordAttemptRepo.delete({
                    adminUserId: user.id
                });
    
                throw new AccountLockedException();
            }
            else {
                attemptsModel.attempts = attemptsModel.attempts + 1;
                await this.adminUserWrongPasswordAttemptRepo.save(attemptsModel);
            }

            throw new FailedException('Either your username or your password or both is incorrect.');
        }

        await this.adminUserWrongPasswordAttemptRepo.delete({
            adminUserId: user.id
        });

        return this.processLogin(user);
    }

    async logout(dto: LogoutDto) {
        let refreshTokenRedisKey = this.refreshTokenRedisKey(dto.refreshToken);
        await this.redis.del(refreshTokenRedisKey);
    }

    private async processLogin(user: AdminUser) {
        const adminUserRoles = await this.adminUserRoleRepo.find({
            where: {
                adminUserId: user.id
            },
            relations: {
                adminRole: true
            }
        });

        const permissions: string[] = [];
        adminUserRoles.forEach(adminUserRole => {
            adminUserRole.adminRole.permissions.forEach(perm => {
                if (!permissions.includes(perm)) {
                    permissions.push(perm);
                }
            });
        });

        const refreshToken = crypto.randomBytes(60).toString('hex');
        const refreshTokenRedisKey = this.refreshTokenRedisKey(refreshToken);
        await this.redis.setex(refreshTokenRedisKey, AuthService.REDIS_AUTH_REFRESH_TOKEN_EXPIRATION, user.id);

        const obj = {
            id: user.id,
            name: user.name,
            permissions
        };

        return {
            status: (user.shouldChangePassword) ? 'should-change-password' : 'success',
            data: {
                accessToken: this.jwtService.sign(obj),
                refreshToken
            }
        };
    }

    async refreshSession(dto: RefreshSessionDto) {
        let refreshTokenRedisKey = this.refreshTokenRedisKey(dto.refreshToken);
        const userIdRaw = await this.redis.get(refreshTokenRedisKey);
        if (!userIdRaw) {
            throw new ForbiddenException();
        }

        const userId = parseInt(userIdRaw);

        // delete the previous refresh token for token rotation
        await this.redis.del(refreshTokenRedisKey);

        const user = await this.repo.findOneBy({
            id: userId
        });
        if (!user) {
            throw new ForbiddenException();
        }

        return this.processLogin(user);
    }

    async changePassword(id: number, dto: ChangePasswordDto) {
        const adminUser = await this.repo.findOneBy({
            id
        });
        if (!adminUser) {
            throw new NotFoundException(`Admin user not found.`);
        }

        const isMatch = await bcrypt.compare(dto.oldPassword, adminUser.password);
        if (!isMatch) {
            throw new NotFoundException(`The old password you entered is incorrect.`);
        }

        const saltRounds = this.config.get('app.adminUserPasswordSaltRounds');
        const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

        adminUser.password = hashedPassword;
        adminUser.lastPasswordChangeDate = new Date();
        adminUser.shouldChangePassword = false;

        await this.repo.save(adminUser);
    }

    private refreshTokenRedisKey(refreshToken: string) {
        const refreshTokenSecret = this.config.get<string>('app.adminUserAuthRefreshTokenSecret');
        const hash = crypto.createHmac('sha512', refreshTokenSecret);
        hash.update(refreshToken);

        const encryptedRefreshToken = hash.digest('hex');

        return AuthService.REDIS_AUTH_REFRESH_TOKEN_KEY.replace(/\$refreshToken/, encryptedRefreshToken);
    }
}