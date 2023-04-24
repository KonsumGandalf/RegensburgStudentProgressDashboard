import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRepository } from '@rspd/shared/backend/test-util';
import { DuplicateSourceException } from '@rspd/shared/backend/utils';
import { Email, IComplexUser, User } from '@rspd/user/backend/common-models';

import { UserService } from './user.service';

describe('UserService', () => {
    let service: UserService;
    let userRepository: MockRepository<User>;
    let users: User[];
    // let emailRepository: MockRepository<Email>;
    let emails: Email[];
    let testUser: IComplexUser;

    beforeEach(async () => {
        users = [];
        emails = [];
        for (let i = 0; i < 3; i++) {
            const email = {
                email: faker.internet.email(),
                isEmailValidated: false,
            } as Email;
            emails.push(email);
            users.push({
                email: email,
                username: faker.internet.userName(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
            } as User);
        }
        testUser = users[1] as unknown as IComplexUser;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useClass: MockRepository,
                },
                {
                    provide: getRepositoryToken(Email),
                    useClass: MockRepository,
                },
            ],
        }).compile();

        service = module.get(UserService);
        userRepository = module.get(getRepositoryToken(User));
        userRepository.entities = users;
        // emailRepository = module.get(getRepositoryToken(Email));
        // emailRepository.entities = emails;
    });

    it('should check if the service is defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        let user: IComplexUser;
        beforeEach(() => {
            user = {
                firstName: 'John',
                lastName: 'Doe',
                email: emails[0],
                username: 'johndoe',
                hashedPassword: 'secret',
            } as unknown as IComplexUser;
            userRepository.entities = [];
        });

        it('should create a new user', async () => {
            const saveSpy = jest
                .spyOn(userRepository, 'save')
                .mockResolvedValueOnce(user as User);

            const result = await service.create(user);

            expect(result).toMatchObject(user);
            expect(saveSpy).toHaveBeenCalledWith(user);
        });

        it('should throw a `DuplicateSourceException` when a user with the same username is created', async () => {
            await service.create(user);

            await expect(service.create(user)).rejects.toThrowError(
                DuplicateSourceException
            );
        });

        it('should throw a `DuplicateSourceException` when a user with the same email is created', async () => {
            await service.create(user);

            user.username = 'different-username';

            await expect(service.create(user)).rejects.toThrowError(
                DuplicateSourceException
            );
        });
    });

    describe('findUserByEmail', () => {
        it('should find a user by email address', async () => {
            const result = await service.findUserByEmail(testUser.email);

            expect(result).toEqual(testUser);
        });
    });

    describe('findUserByUsername', () => {
        it('should find a user by username', async () => {
            const result = await service.findUserByUsername(testUser.username);

            expect(result).toEqual(testUser);
        });
    });
});
