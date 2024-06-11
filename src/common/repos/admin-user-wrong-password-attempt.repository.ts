import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AdminUserWrongPasswordAttempt } from '../entities/admin-user-wrong-password-attempt.entity';

@Injectable()
export class AdminUserWrongPasswordAttemptRepository extends Repository<AdminUserWrongPasswordAttempt> {

    constructor(private readonly dataSource: DataSource) {
        super(AdminUserWrongPasswordAttempt, dataSource.createEntityManager());
    }

}
