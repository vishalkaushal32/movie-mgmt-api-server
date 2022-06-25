import { Repository } from "typeorm";
import { EntityRepository } from "typeorm/decorator/EntityRepository";
import { FileEntity } from "./entities/file.entity";

@EntityRepository(FileEntity)
export class FileRepository extends Repository<FileEntity> { }
