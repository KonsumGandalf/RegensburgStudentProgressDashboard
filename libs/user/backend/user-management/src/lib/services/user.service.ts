import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DuplicateSourceException } from '@rspd/shared/backend/utils';
import { IComplexUser, User } from '@rspd/user/backend/common-models';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly _userRepository: Repository<User>
    ) {}

    /**
     * Creates a new user.
     * @async
     * @param {IComplexUser} user - The user object to create.
     * @returns {Promise<User>} The created user object.
     */
    async create(user: IComplexUser): Promise<IComplexUser> {
        const entitiesUsername = await this.findUserByUsername(user.username);
        if (entitiesUsername) {
            throw new DuplicateSourceException('username');
        }
        const entitiesEmail = await this.findUserByEmail(user.email);
        if (entitiesEmail) {
            throw new DuplicateSourceException('email');
        }

        const userEntity = this._userRepository.create({
            ...user,
        } as unknown as User);
        return await this._userRepository.save(userEntity);
    }

    /**
     * Finds a user by email address.
     * @async
     * @param {string} email - The email address to search for.
     * @returns {Promise<IComplexUser>} The user object found by email address.
     */
    async findUserByEmail(email: any): Promise<IComplexUser> {
        return await this._userRepository.findOne({
            where: { email: email },
            relations: ['email'],
        });
    }

    /**
     * Finds a user by username.
     * @async
     * @param {string} username - The username to search for.
     * @param {boolean} [relations=false] - Whether to include email relations.
     * @returns {Promise<IComplexUser>} The user object found by username.
     */
    async findUserByUsername(
        username: string,
        relations = false
    ): Promise<IComplexUser> {
        return relations
            ? await this._userRepository.findOne({
                  where: { username },
                  relations: ['email'],
              })
            : await this._userRepository.findOne({ where: { username } });
    }

    /**
     * Finds a user by ID.
     * @async
     * @param {string} id - The ID of the user to search for.
     * @param {boolean} [relations=false] - Whether to include email relations.
     * @returns {Promise<IComplexUser>} The user object found by ID.
     */
    async findUser(id: string, relations = false): Promise<IComplexUser> {
        return relations
            ? await this._userRepository.findOne({
                  where: { id },
                  relations: ['email'],
              })
            : await this._userRepository.findOne({ where: { id } });
    }
}
