import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne
} from 'typeorm';
import { AdminUserRole } from './admin-user-role.entity';

@Entity({
    name: 'admin_roles'
})
export class AdminRole {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column('json')
    permissions: string[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @OneToOne(type => AdminUserRole)
    adminUserRole: AdminUserRole;

}
