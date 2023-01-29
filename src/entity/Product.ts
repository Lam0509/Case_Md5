import {
    Column,
    Entity, JoinTable, ManyToMany, OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import {Assessment} from "./Assessment";
import {OrderDetail} from "./OrderDetail";
import {Category} from "./Category";

@Entity()

export class Product {

    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column({ type: "varchar" , length: 45 })
    public name: string;

    @Column({ type: "varchar" , length: 255 })
    public image: string;

    @Column({ type: "int" })
    public price: number;

    @Column({ type: "int" })
    public quantity: number;

    @Column({ type: "boolean", default: 1 })
    public status: boolean;

    @Column({ type: "longtext", default: null })
    public description: string;

    @ManyToMany(type => Category, category => category.products)
    @JoinTable({name: 'productCategories'})
    categories: Category[]

    @OneToMany(type => Assessment, assessment => assessment.product)
    assessments: Assessment[]

    @OneToMany(type => OrderDetail, orderDetail => orderDetail.product)
    orderDetails: OrderDetail[]

}