import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn
} from 'typeorm';
import { AdminRole } from './admin-role.entity';

@Entity({
    name: 'admin_user_roles'
})
export class AdminUserRole {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    adminUserId: number;

    @Column()
    adminRoleId: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @OneToOne(type => AdminRole)
    @JoinColumn()
    adminRole: AdminRole;

}
