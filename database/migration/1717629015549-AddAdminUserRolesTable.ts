import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminUserRolesTable1717629015549 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE admin_user_roles (
            id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            admin_user_id INT(10) UNSIGNED REFERENCES admin_users(id),
            admin_role_id INT(10) UNSIGNED REFERENCES admin_roles(id),
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE admin_user_roles`);
    }

}
