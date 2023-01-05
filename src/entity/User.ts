import {
    Column,
    Entity, OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import {Assessment} from "./Assessment";
import {Order} from "./Order";
import {Gender} from "./Admin";

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

    @Column({ type: 'varchar', length: 45 })
    public password: string;

    @OneToMany(type => Assessment, assessment => assessment.user)
    assessments: Assessment[]

    @OneToMany(type => Order, order => order.user)
    orders: Order[]

}