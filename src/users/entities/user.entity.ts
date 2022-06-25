import { randomUUID } from "crypto";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: String;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column()
    role: string;

}
