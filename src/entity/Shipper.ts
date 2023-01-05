import {
    Column,
    Entity, OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import {Order} from "./Order";
import {Gender} from "./Admin";

@Entity()

export class Shipper {

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

    @Column({ type: "varchar", length: 10 })
    public phone: string;

    @Column({ type: "bit",
        transformer: { from: (v: Buffer) => !!v?.readInt8(0), to: (v) => v },
    })
    public status: boolean;

    @OneToMany(type => Order, order => order.shipper)
    orders: Order[]

}