import { In } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AdminUserRole } from '@common/entities/admin-user-role.entity';
import { AdminUserRoleRepository } from '@common/repos/admin-user-role.repository';

@Injectable()
export class AdminUserRoleService {

    constructor(
        private readonly repo: AdminUserRoleRepository
    ) {}

    async addUsersToAdminRole(id: number, adminUserIds: number[]) {
        const promises: Promise<AdminUserRole>[] = [];

        for (let i = 0; i < adminUserIds.length; i += 1) {
            const adminUserAdminRole = new AdminUserRole();
            adminUserAdminRole.adminRoleId = id;
            adminUserAdminRole.adminUserId = adminUserIds[i];

            promises.push(this.repo.save(adminUserAdminRole));
        }

        await Promise.all(promises);
    }

    async removeUsersFromAdminRole(id: number, adminUserIds: number[]) {
        await this.repo.delete({
            adminRoleId: id,
            adminUserId: In(adminUserIds)
        });
    }

}