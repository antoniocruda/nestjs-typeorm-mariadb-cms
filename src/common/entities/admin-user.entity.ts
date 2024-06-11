import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';

export type AdminUserStatus = 'active' | 'inactive' | 'locked';

@Entity({
    name: 'admin_users'
})
export class AdminUser {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column()
    status: string;

    @Column('boolean')
    shouldChangePassword: boolean;

    @Column('timestamp')
    lastPasswordChangeDate: Date;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

}
