import { Injectable } from '@nestjs/common';
import { DataSource, FindManyOptions, Raw, Repository } from 'typeorm';
import { AdminRole } from '../entities/admin-role.entity';

@Injectable()
export class AdminRoleRepository extends Repository<AdminRole> {

    constructor(private readonly dataSource: DataSource) {
        super(AdminRole, dataSource.createEntityManager());
    }

    findByKeywordWithPaginationAndCount(
        keyword: string,
        limit = 20,
        page = 1
    ): Promise<[AdminRole[], number]> {
        const options: FindManyOptions<AdminRole> = {
            take: limit,
            skip: ((page - 1) * limit),
            order: {
                name: 'ASC'
            }
        };

        if (keyword && keyword !== '') {
            options.where = {
                name: Raw(
                    (alias) => `(${alias} LIKE :value)`,
                    { value: `%${keyword}%`}
                )
            };
        }

        return this.findAndCount(options);
    }

}
