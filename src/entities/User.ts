import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tenant } from './tenents';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column({
        unique: true,
    })
    email: string;

    @Column()
    password: string;

    @Column({
        default: 'customer',
    })
    @Column()
    role: string;

    @ManyToOne(() => Tenant)
    tenant: Tenant;
}
