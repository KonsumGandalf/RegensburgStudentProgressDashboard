import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DuplicateSourceException, IUser } from '@rspd/shared/backend/utils';
import { IAppConfig } from '@rspd/shared/backend/utils';
import { IComplexUser, UserService } from '@rspd/user/backend/user-management';
import * as bcrypt from 'bcrypt';

import { LoginUserDto } from '../models/dtos/login-user.dto';
import { RegisterUserDto } from '../models/dtos/register-user.dto';
import { IAuthUser } from '../models/interfaces/auth-user.interface';
import { IResponseLogin } from '../models/interfaces/response-login.interfaces';

@Injectable()
export class AuthService {
    constructor(
        private readonly _usersService: UserService,
        private readonly _configService: ConfigService<IAppConfig>,
        private readonly _jwtService: JwtService
    ) {}

    async register(user: RegisterUserDto) {
        if (await this._usersService.findUserByUsername(user.username)) {
            throw new DuplicateSourceException('email');
        } else if (await this._usersService.findUserByEmail(user.email)) {
            throw new DuplicateSourceException('username');
        }

        if (user.password != user.confirmPassword) {
            throw new ConflictException(
                'password and confirmPassword must match'
            );
        }

        const saltRounds = this._configService.get('auth', {
            infer: true,
        }).saltRounds;
        const hash = await bcrypt.hash(user.password, saltRounds);
        return this._usersService.create({
            ...user,
            hashedPassword: hash,
        } as unknown as IComplexUser);
    }

    async validateUserCredentials(
        userDto: LoginUserDto
    ): Promise<IAuthUser | null> {
        const user = await this._usersService.findUserByUsername(
            userDto.username
        );
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return (
            {
                user: user,
                password: userDto.password,
            } ?? null
        );
    }

    async login(user: IUser): Promise<IResponseLogin> {
        return {
            access_token: this._jwtService.sign(user),
        };
    }
}
