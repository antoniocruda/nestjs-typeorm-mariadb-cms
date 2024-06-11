import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AdminUserRole } from '../entities/admin-user-role.entity';

@Injectable()
export class AdminUserRoleRepository extends Repository<AdminUserRole> {

    constructor(private readonly dataSource: DataSource) {
        super(AdminUserRole, dataSource.createEntityManager());
    }

}
