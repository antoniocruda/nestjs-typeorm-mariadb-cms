import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminUsersTable1717625858426 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE admin_users (
            id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL DEFAULT '',
            email VARCHAR(300) DEFAULT '',
            password VARCHAR(250) NOT NULL DEFAULT '',
            name VARCHAR(250) NOT NULL DEFAULT '',
            status VARCHAR(20) NOT NULL DEFAULT 'active',
            should_change_password TINYINT(1) DEFAULT 0,
            last_password_change_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE INDEX admin_users_username (username) USING BTREE
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE admin_users`);
    }

}
