import {
    Entity,
    Column,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity({
    name: 'admin_user_wrong_password_attempts'
})
export class AdminUserWrongPasswordAttempt {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    adminUserId: number;

    @Column()
    attempts: number;

}
