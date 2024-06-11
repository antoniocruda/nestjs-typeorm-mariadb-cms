import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminUser } from './../../src/common/entities/admin-user.entity';
import { AdminRole } from './../../src/common/entities/admin-role.entity';
import { AdminUserRole } from './../../src/common/entities/admin-user-role.entity';

export class AddInitialAdminUserData1717732210333 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const adminRoleRepo = queryRunner.manager.getRepository<AdminRole>(AdminRole);
        const adminUserRepo = queryRunner.manager.getRepository<AdminUser>(AdminUser);
        const adminUserRoleRepo = queryRunner.manager.getRepository<AdminUserRole>(AdminUserRole);
        
        const hashedPassword = await bcrypt.hash('Pa$$w0rd', 10);

        let adminUser = new AdminUser();
        adminUser.name = 'Admin Admin';
        adminUser.username = 'admin';
        adminUser.password = hashedPassword;
        adminUser.email = 'admin@email.com';
        adminUser.shouldChangePassword = false;
        adminUser.lastPasswordChangeDate = new Date();

        adminUser = await adminUserRepo.save(adminUser);

        let adminRole = new AdminRole();
        adminRole.name = 'Super Admin';
        adminRole.description = 'The role for users with super admin permissions';
        adminRole.permissions = [
            'admin-user.view',
            'admin-user.create',
            'admin-user.update',
            'admin-user.delete',
            'admin-user.change-password',
            'admin-role.view',
            'admin-role.create',
            'admin-role.update',
            'admin-role.delete',
            'admin-role.manage-users'
        ];

        adminRole = await adminRoleRepo.save(adminRole);

        const adminUserRole = new AdminUserRole();
        adminUserRole.adminRoleId = adminRole.id;
        adminUserRole.adminUserId = adminUser.id;

        await adminUserRoleRepo.save(adminUserRole);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const adminRoleRepo = queryRunner.manager.getRepository<AdminRole>(AdminRole);
        const adminUserRepo = queryRunner.manager.getRepository<AdminUser>(AdminUser);
        const adminUserRoleRepo = queryRunner.manager.getRepository<AdminUserRole>(AdminUserRole);

        await adminUserRoleRepo.delete({});
        await adminUserRepo.delete({});
        await adminRoleRepo.delete({});
    }

}
