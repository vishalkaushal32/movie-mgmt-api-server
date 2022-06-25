import { randomUUID } from "crypto";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class FileEntity {

    @PrimaryGeneratedColumn('uuid')
    id: String;

    @Column()
    fileName: string;

    @Column()
    path: string;

    @Column()
    type: string;

    @Column({
        unique: true
    })
    passkey: string;
}
