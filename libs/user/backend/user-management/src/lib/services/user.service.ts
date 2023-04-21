import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../models/entities/user.entity';
import { IComplexUser } from '../models/interfaces/complex-user.interface';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly _userRepository: Repository<User>
    ) {}

    async create(user: IComplexUser) {
        const userEntity = this._userRepository.create({
            ...user,
        } as unknown as User);
        return await this._userRepository.save(userEntity);
    }

    async findUserByEmail(email: string): Promise<IComplexUser> {
        return await this._userRepository.findOne({ where: { email } });
    }

    async findUserByUsername(username: string): Promise<IComplexUser> {
        return await this._userRepository.findOne({ where: { username } });
    }

    async findById(id: string): Promise<IComplexUser> {
        return await this._userRepository.findOne({ where: { id } });
    }
}
