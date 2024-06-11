import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from '@common/common.module';
import { AdminUser } from '@common/entities/admin-user.entity';
import { AdminRole } from '@common/entities/admin-role.entity';
import { AdminUserRole } from '@common/entities/admin-user-role.entity';
import { AdminUserRepository } from '@common/repos/admin-user.repository';
import { AdminRoleRepository } from '@common/repos/admin-role.repository';
import { AdminUserRoleRepository } from '@common/repos/admin-user-role.repository';
import { AdminUserWrongPasswordAttempt } from '@common/entities/admin-user-wrong-password-attempt.entity';
import { AdminUserWrongPasswordAttemptRepository } from '@common/repos/admin-user-wrong-password-attempt.repository';
import { AdminRoleService } from './services/admin-role.service';
import { AdminUserRoleService } from './services/admin-user-role.service';
import { AdminUserService } from './services/admin-user.service';
import { AuthService } from './services/auth.service';
import { AdminRoleController } from './controllers/admin-role.controller';
import { AdminUserController } from './controllers/admin-user.controller';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PermissionsGuard } from './auth/permissions.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AdminUser,
            AdminRole,
            AdminUserRole,
            AdminUserWrongPasswordAttempt
        ]),
        CommonModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('app.adminJwtSecret'),
                signOptions: { expiresIn: '60m' }
            }),
            inject: [ConfigService]
        })
    ],
    controllers: [
        AdminRoleController,
        AdminUserController,
        AuthController
    ],
    providers: [
        AdminUserRepository,
        AdminRoleRepository,
        AdminUserRoleRepository,
        AdminUserWrongPasswordAttemptRepository,
        AdminRoleService,
        AdminUserRoleService,
        AdminUserService,
        AuthService,
        JwtStrategy,
        JwtAuthGuard,
        PermissionsGuard
    ]
})
export class CmsModule {}
