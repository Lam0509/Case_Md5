import {
    Column,
    Entity, ManyToOne, PrimaryGeneratedColumn
} from "typeorm";
import {Order} from "./Order";
import {Product} from "./Product";

@Entity()

export class OrderDetail {

    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column({ type: "int" })
    public quantity: number;

    @ManyToOne(type => Order, order => order.orderDetails)
    order: Order

    @ManyToOne(type => Product, product => product.orderDetails)
    product: Product

}