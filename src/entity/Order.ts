import {
    Column,
    Entity, ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import {User} from "./User";
import {Shipper} from "./Shipper";
import {OrderDetail} from "./OrderDetail";

type Status = 'Đã tiếp nhận' | 'Đang xử lý' | 'Đang giao' | 'Đã giao'

@Entity()

export class Order {

    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column({ type: "date" })
    public date: string;

    @ManyToOne(type => User, user => user.orders)
    user: User

    @ManyToOne(type => Shipper, shipper => shipper.orders)
    shipper: Shipper

    @Column({ type: "enum", enum: ['Đã tiếp nhận' ,'Đang xử lý' ,'Đang giao', 'Đã giao'], default: 'Đã tiếp nhận' })
    public status: Status;

    @OneToMany(type => OrderDetail, orderDetail => orderDetail.order)
    orderDetails: OrderDetail[]

}