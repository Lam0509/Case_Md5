import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

export type Gender = 'Nam' | 'Nữ' | 'Giới tính khác'

@Entity()

export class Admin {

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

    @Column({ type: "varchar", length: 45 })
    public email: string;

    @Column({ type: 'varchar', length: 45 })
    public password: string;

}