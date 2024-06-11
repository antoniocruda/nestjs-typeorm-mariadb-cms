import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminRolesTable1717628882658 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE admin_roles (
            id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NULL DEFAULT '',
            description TEXT NULL DEFAULT '',
            permissions JSON NULL DEFAULT '[]' COLLATE 'utf8mb4_bin',
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE admin_roles`);
    }

}
