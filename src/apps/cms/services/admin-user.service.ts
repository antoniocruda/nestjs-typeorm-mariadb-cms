import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AdminUserRepository } from '@common/repos/admin-user.repository';
import { AdminUserRoleRepository } from '@common/repos/admin-user-role.repository';
import { AdminUserWrongPasswordAttemptRepository } from '@common/repos/admin-user-wrong-password-attempt.repository';
import { AdminUser, AdminUserStatus } from '@common/entities/admin-user.entity';
import { AlreadyExistsException } from '@common/exceptions/already-exists.exception';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { FailedException } from '@common/exceptions/failed.exception';
import { fillUpObjectWithDtoValues } from '@common/helpers/dto';
import { generateSecurePassword } from '@common/helpers/security';
import { FormDto } from '../dto/admin-user/form.dto';

@Injectable()
export class AdminUserService {

    constructor(
        private readonly repo: AdminUserRepository,
        private readonly adminUserRole: AdminUserRoleRepository,
        private readonly config: ConfigService,
        private readonly adminUserWrongPasswordAttemptRepo: AdminUserWrongPasswordAttemptRepository
    ){}
    
    async create(dto: FormDto) {
        const user = await this.repo.findOneBy({
            username: dto.username
        });
        if (user) {
            throw new AlreadyExistsException(`An account with username "${dto.username}" already exists`);
        }

        if (dto.email !== '') {
            const isEmailExists = await this.repo.findOneBy({
                email: dto.email
            });
            if (isEmailExists) {
                throw new AlreadyExistsException(`An account with email "${dto.email}" already exists`);
            }
        }

        const newPassword = generateSecurePassword(16);
        const saltRounds = this.config.get('app.adminUserPasswordSaltRounds');
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const adminUser = fillUpObjectWithDtoValues<AdminUser>(new AdminUser(), dto);
        adminUser.password = hashedPassword;
        adminUser.lastPasswordChangeDate = new Date();
        adminUser.shouldChangePassword = true;

        await this.repo.save(adminUser);

        return newPassword;
    }

    async update(id: number, dto: FormDto) {
        let adminUser = await this.repo.findOneBy({
            id
        });
        if (!adminUser) {
            throw new NotFoundException('Admin user not found.');
        }

        const user = await this.repo.findOneBy({
            username: dto.username
        });
        if (user && user.id !== adminUser.id) {
            throw new AlreadyExistsException(`An account with username "${dto.username}" already exists`);
        }

        if (user.email !== dto.email && dto.email !== '') {
            const isEmailExists = await this.repo.findOneBy({
                email: dto.email
            });
            if (isEmailExists) {
                throw new AlreadyExistsException(`An account with email "${dto.email}" already exists`);
            }
        }

        adminUser = fillUpObjectWithDtoValues<AdminUser>(adminUser, dto);

        return this.repo.save(adminUser);
    }

    async updateStatus(id: number, newStatus: AdminUserStatus) {
        const adminUser = await this.repo.findOneBy({
            id
        });
        if (!adminUser) {
            throw new NotFoundException('Admin user not found.');
        }   

        adminUser.status = newStatus;

        await this.repo.save(adminUser);

        return true;
    }

    async deleteAdminUser(id: number) {
        const adminUser = await this.repo.findOneBy({
            id
        });
        if (!adminUser) {
            throw new NotFoundException('Admin user not found.');
        }

        const assignedToAdminUserAdminRoleCount = await this.adminUserRole.countBy({
            adminUserId: id
        });
        if (assignedToAdminUserAdminRoleCount > 0) {
            throw new FailedException('This user have been added to a role. Removed first this user to all roles, then delete this again.');
        }

        await this.adminUserWrongPasswordAttemptRepo.delete({
            adminUserId: adminUser.id
        });
        await this.repo.delete(id);
    }

    async generateNewPassword(id: number) {
        const adminUser = await this.repo.findOneBy({
            id
        });
        if (!adminUser) {
            throw new NotFoundException('Admin user not found.');
        }

        const newPassword = generateSecurePassword(16);
        const saltRounds = this.config.get('app.adminUserPasswordSaltRounds');
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        adminUser.password = hashedPassword;

        await this.repo.save(adminUser);

        return newPassword;
    }
    
}