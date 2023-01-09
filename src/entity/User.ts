import {
    Column,
    Entity, OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import {Assessment} from "./Assessment";
import {Order} from "./Order";

export type Gender = 'Nam' | 'Nữ' | 'Giới tính khác';
type Role = 'admin' | 'user'

@Entity()

export class User {

    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column({ type: "varchar" , length: 45 })
    public name: string;

    @Column({ type: "tinyint" })
    public age: number;

    @Column({ type: "enum", enum: ['Nam', 'Nữ', 'Giới tính khác']})
    public gender: Gender;

    @Column({ type: "varchar" , length: 255 })
    public image: string;

    @Column({ type: "varchar" , length: 255 })
    public address: string;

    @Column({ type: "varchar" , length: 10 })
    public phone: string;

    @Column({ type: "varchar", length: 45 })
    public email: string;

    @Column({ type: 'varchar', length: 255 })
    public password: string;

    @Column({ type: "enum", enum: ['admin', 'user'], default: 'user'})
    public role: Role;

    @OneToMany(type => Assessment, assessment => assessment.user)
    assessments: Assessment[]

    @OneToMany(type => Order, order => order.user)
    orders: Order[]

}