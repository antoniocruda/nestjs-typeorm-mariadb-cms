import { Injectable } from '@nestjs/common';
import { DataSource, FindManyOptions, FindOptionsWhere, Raw, Repository } from 'typeorm';
import { AdminUser, AdminUserStatus } from '../entities/admin-user.entity';

@Injectable()
export class AdminUserRepository extends Repository<AdminUser> {

    constructor(private readonly dataSource: DataSource) {
        super(AdminUser, dataSource.createEntityManager());
    }

    findByKeywordAndStateWithPaginationAndCount(
        keyword: string,
        status: string,
        limit = 20,
        page = 1
    ): Promise<[AdminUser[], number]> {
        const options: FindManyOptions<AdminUser> = {
            take: limit,
            skip: ((page - 1) * limit),
            order: {
                name: 'ASC'
            }
        };

        const findCondition: FindOptionsWhere<AdminUser> = {};

        if (status && status !== 'all') {
            findCondition.status = status as AdminUserStatus;
        }

        if (keyword && keyword !== '') {
            findCondition.name = Raw(
                (alias) => `(${alias} LIKE :value OR username LIKE :value)`,
                { value: `%${keyword}%`}
            );
        }

        options.where = findCondition;

        return this.findAndCount(options);
    }

    findByNameAndNotInAdminRole(
        adminRoleId: number,
        name: string,
        limit = 20,
        page = 1
    ): Promise<AdminUser[]> {
        const subQuery = `
            SELECT admin_user_id
            FROM admin_user_roles
            WHERE admin_role_id = :adminRoleId
        `;

        return this.find({
            where: {
                name: Raw((alias) => `(${alias} LIKE :name)`, { name: `%${name}%`}),
                id: Raw((alias) => `${alias} NOT IN (${subQuery})`, { adminRoleId }),
            },
            take: limit,
            skip: ((page - 1) * limit),
            order: {
                name: 'ASC'
            }
        });
    }

    findByNameAndInAdminRole(
        adminRoleId: number,
        name: string,
        limit = 20,
        page = 1
    ): Promise<AdminUser[]> {
        const subQuery = `
            SELECT admin_user_id
            FROM admin_user_roles
            WHERE admin_role_id = :adminRoleId
        `;

        return this.find({
            where: {
                name: Raw((alias) => `${alias} LIKE :name`, { name: `%${name}%`}),
                id: Raw((alias) => `${alias} IN (${subQuery})`, { adminRoleId }),
            },
            take: limit,
            skip: ((page - 1) * limit),
            order: {
                name: 'ASC'
            }
        });
    }

}
