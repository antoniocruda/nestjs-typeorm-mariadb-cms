import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminUserWrongPasswordAttempts1717631033861 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE admin_user_wrong_password_attempts (
            id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            admin_user_id INT(10) UNSIGNED REFERENCES admin_users(id),
            attempts INT4 DEFAULT 0
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE admin_user_wrong_password_attempts`);
    }

}
