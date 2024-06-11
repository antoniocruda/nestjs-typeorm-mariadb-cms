import {
    Controller,
    Param,
    Post,
    Body,
    Get,
    Query,
    Delete,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
    ParseIntPipe
} from '@nestjs/common';
import { AdminUserRepository } from '@common/repos/admin-user.repository';
import { AdminUserService } from '../services/admin-user.service';
import { SearchDto } from '../dto/admin-user/search.dto';
import { FormDto } from '../dto/admin-user/form.dto';
import { UpdateStatusDto } from '../dto/admin-user/update-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permission } from '../auth/permission.decorator';

@UseGuards(PermissionsGuard)
@UseGuards(JwtAuthGuard)
@Controller({
    path: 'admin-user'
})
export class AdminUserController {
    
    constructor(
        private readonly repo: AdminUserRepository,
        private readonly service: AdminUserService
    ) {}
    
    @Post(':adminUserId/generate-new-password')
    @Permission('admin-user.change-password')
    async changePassword(
        @Param('adminUserId', ParseIntPipe) adminUserId: number
    ) {
        return this.service.generateNewPassword(adminUserId);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post('create')
    @Permission('admin-user.create')
    create(
        @Body() dto: FormDto
    ) {
        return this.service.create(dto);
    }

    @Delete(':adminUserId')
    @Permission('admin-user.delete')
    async deleteAdminUser(
        @Param('adminUserId', ParseIntPipe) adminUserId: number
    ) {
        await this.service.deleteAdminUser(adminUserId)

        return 'OK';
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('list')
    @Permission('admin-user.view')
    list() {
        return this.repo.find();
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('search')
    @Permission('admin-user.view')
    async search(
        @Query() dto: SearchDto
    ) {
        const keyword:string = dto.keyword || '';
        const limit = dto.limit || 20;
        const page = dto.page || 1;
        const status = dto.status || 'all';

        const [list, total] = await this.repo.findByKeywordAndStateWithPaginationAndCount(
            keyword, status, limit, page
        );

        return { list, total };
    }

    @Post(':adminUserId/update')
    @Permission('admin-user.update')
    async update(
        @Param('adminUserId', ParseIntPipe) adminUserId: number,
        @Body() dto: FormDto
    ) {
        return this.service.update(adminUserId, dto);
    }

    @Post(':adminUserId/update-status')
    @Permission('admin-user.update')
    async updateStatus(
        @Param('adminUserId', ParseIntPipe) adminUserId: number,
        @Body() dto: UpdateStatusDto
    ) {
         await this.service.updateStatus(adminUserId, dto.status);
        
        return 'OK';
    }

}
