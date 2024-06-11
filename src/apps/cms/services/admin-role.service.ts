import { Injectable } from '@nestjs/common';
import { AdminRole } from '@common/entities/admin-role.entity';
import { FailedException } from '@common/exceptions/failed.exception';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { AdminRoleRepository } from '@common/repos/admin-role.repository';
import { AdminUserRoleRepository } from '@common/repos/admin-user-role.repository';
import { fillUpObjectWithDtoValues } from '@common/helpers/dto';
import adminRolePermissions from './../data/admin-role-permissions.json';
import { FormDto } from '../dto/admin-role/form.dto';

export interface AdminRolePermission {
    page: string;
    permissions: string[];
}

@Injectable()
export class AdminRoleService {
    
    constructor(
        private readonly repo: AdminRoleRepository,
        private readonly adminUserRoleRepo: AdminUserRoleRepository
    ){}
    
    async create(dto: FormDto) {
        const adminRole = fillUpObjectWithDtoValues<AdminRole>(new AdminRole(), dto);

        await this.repo.save(adminRole);
    }

    async deleteAdminRole(id: number) {
        const adminRole = await this.repo.findOneBy({
            id
        });
        if (!adminRole) {
            throw new NotFoundException('Admin role not found.');
        }

        const assignedToAdminRoleCount = await this.adminUserRoleRepo.countBy({
            adminRoleId: id
        });
        if (assignedToAdminRoleCount > 0) {
            throw new FailedException('A user have been added to this role. Removed first the user, then delete this again.');
        }

        await this.repo.delete(id);
    }

    permissionsList() {
        return adminRolePermissions;
    }

    async update(id: number, dto: FormDto) {
        let adminRole = await this.repo.findOneBy({
            id
        });
        if (!adminRole) {
            throw new NotFoundException('Admin role not found.');
        }

        adminRole = fillUpObjectWithDtoValues<AdminRole>(adminRole, dto);

        return this.repo.save(adminRole);
    }

}