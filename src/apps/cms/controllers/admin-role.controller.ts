import {
    Controller,
    Param,
    Post,
    Body,
    ParseUUIDPipe,
    Get,
    Query,
    Delete,
    UseGuards,
    ParseIntPipe
} from '@nestjs/common';
import { AdminRoleRepository } from '@common/repos/admin-role.repository';
import { AdminUserRepository } from '@common/repos/admin-user.repository';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permission } from '../auth/permission.decorator';
import { AdminRoleService } from '../services/admin-role.service';
import { AdminUserRoleService } from '../services/admin-user-role.service';
import { AddUserToAdminRoleDto } from '../dto/admin-role/add-user-to-admin-role.dto';
import { RemoveUsersFromAdminRoleDto } from '../dto/admin-role/remove-users-from-admin-role.dto';
import { FormDto } from '../dto/admin-role/form.dto';
import { SearchDto } from '../dto/admin-role/search.dto';
import { SearchAdminRoleUsersDto } from '../dto/admin-role/search-admin-role-users.dto';

@UseGuards(PermissionsGuard)
@UseGuards(JwtAuthGuard)
@Controller({
    path: 'admin-role'
})
export class AdminRoleController {
    
    constructor(
        private readonly repo: AdminRoleRepository,
        private readonly adminUserRepo: AdminUserRepository,
        private readonly service: AdminRoleService,
        private readonly adminUserRoleService: AdminUserRoleService
    ) {}

    @Post(':adminRoleId/add-user-to-admin-role')
    @Permission('admin-role.manage-users')
    async addUsersToAdminRole(
        @Param('adminRoleId', ParseIntPipe) adminRoleId: number,
        @Body() dto: AddUserToAdminRoleDto
    ) {
        await this.adminUserRoleService.addUsersToAdminRole(
            adminRoleId,
            dto.adminUserIds
        );
        
        return 'OK';
    }

    @Post('create')
    @Permission('admin-role.create')
    async create(
        @Body() dto: FormDto
    ) {
        return this.service.create(dto);
    }

    @Delete(':adminRoleId')
    @Permission('admin-role.delete')
    async deleteAdminRole(
        @Param('adminRoleId', ParseIntPipe) adminRoleId: number
    ) {
        await this.service.deleteAdminRole(adminRoleId);

        return 'OK';
    }

    @Get('permissions-list')
    @Permission('admin-role.view')
    async permissionsList() {
        return this.service.permissionsList();
    }

    @Post(':adminRoleId/remove-users-from-admin-role')
    @Permission('admin-role.manage-users')
    async removeUsersFromAdminRole(
        @Param('adminRoleId', ParseIntPipe) adminRoleId: number,
        @Body() dto: RemoveUsersFromAdminRoleDto
    ) {
        await this.adminUserRoleService.removeUsersFromAdminRole(
            adminRoleId,
            dto.adminUserIds
        );
        
        return 'OK';
    }

    @Get('search')
    @Permission('admin-role.view')
    async search(
        @Query() dto: SearchDto
    ) {
        const keyword:string = dto.keyword || '';
        const limit = dto.limit || 20;
        const page = dto.page || 1;

        const [list, total] = await this.repo.findByKeywordWithPaginationAndCount(
            keyword, limit, page
        );

        return {
            list,
            total
        };
    }

    @Post(':adminRoleId/update')
    @Permission('admin-role.update')
    update(
        @Param('adminRoleId', ParseIntPipe) adminRoleId: number,
        @Body() dto: FormDto
    ) {
        return this.service.update(adminRoleId, dto);
    }

    @Get(':adminRoleId/search-not-added-users')
    @Permission('admin-role.view')
    searchNotAddedUsers(
        @Param('adminRoleId', ParseIntPipe) adminRoleId: number,
        @Query() dto: SearchAdminRoleUsersDto
    ) {
        const keyword = dto.keyword || '';
        const limit = dto.limit || 20;

        return this.adminUserRepo.findByNameAndNotInAdminRole(
            adminRoleId,
            keyword,
            limit,
            1
        );
    }

    @Get(':adminRoleId/search-users')
    @Permission('admin-role.view')
    searchAdminRoleUsers(
        @Param('adminRoleId', ParseIntPipe) adminRoleId: number,
        @Query() dto: SearchAdminRoleUsersDto
    ) {
        const keyword = dto.keyword || '';
        const limit = dto.limit || 20;

        return this.adminUserRepo.findByNameAndInAdminRole(
            adminRoleId,
            keyword,
            limit,
            1
        );
    }
  
}
