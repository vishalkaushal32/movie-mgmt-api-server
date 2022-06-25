import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {

    private userRepository: UserRepository;
    constructor(private connection: Connection) {
        this.userRepository = this.connection.getCustomRepository(UserRepository);

    }

    async findOne(username: string): Promise<any | undefined> {
        return this.userRepository.findOne({ where: { name: username } });
    }
}
