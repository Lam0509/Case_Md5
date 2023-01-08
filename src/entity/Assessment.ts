import {
    Column,
    Entity, ManyToOne, PrimaryGeneratedColumn,
} from "typeorm";
import {User} from "./User";
import {Product} from "./Product";

type Point = 1 | 2 | 3 | 4 | 5

@Entity()

export class Assessment {

    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column({ type: "varchar" , length: 255 })
    public comment: string;

    @Column({ type: "varchar" , length: 255 })
    public image: string;

    @Column({ type: "enum", enum: [1, 2, 3, 4, 5]})
    public point: Point;

    @ManyToOne(type => User, user => user.assessments)
    user: User

    @ManyToOne(type => Product, product => product.assessments)
    product: Product

}