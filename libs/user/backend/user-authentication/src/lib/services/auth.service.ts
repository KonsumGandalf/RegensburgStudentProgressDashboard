import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IAppConfig } from '@rspd/shared/backend/utils';
import { IEmail, IUser } from '@rspd/user/backend/common-models';
import { UserMailService } from '@rspd/user/backend/user-mail-management';
import { IComplexUser, UserService } from '@rspd/user/backend/user-management';
import * as bcrypt from 'bcrypt';

import { LoginUserDto } from '../models/dtos/login-user.dto';
import { RegisterUserDto } from '../models/dtos/register-user.dto';
import { IAuthUser } from '../models/interfaces/auth-user.interface';
import { IResponseAuthentication } from '../models/interfaces/response-login.interfaces';
import { IVerificationToken } from '../models/interfaces/verfication-token-email.interface';

/**
 * Service responsible for handling user authentication-related tasks.
 */
@Injectable()
export class AuthService {
    /**
     * Creates an instance of AuthService.
     *
     * @param {UserService} _usersService - The user service.
     * @param {UserMailService} _emailService - The user mail service.
     * @param {ConfigService<IAppConfig>} _configService - The config service.
     * @param {JwtService} _jwtService - The JSON web token service.
     */
    constructor(
        private readonly _usersService: UserService,
        private readonly _emailService: UserMailService,
        private readonly _configService: ConfigService<IAppConfig>,
        private readonly _jwtService: JwtService
    ) {}

    /**
     * Registers a new user.
     *
     * @param {RegisterUserDto} user - The user to register.
     * @returns {Promise<IResponseAuthentication>} The registered user.
     * @throws {DuplicateSourceException} If the username or email already exists.
     * @throws {ConflictException} If the password and confirmPassword fields do not match.
     * @throws {Error} If any other error occurs.
     */
    async register(user: RegisterUserDto): Promise<IResponseAuthentication> {
        if (user.password != user.confirmPassword) {
            throw new ConflictException(
                'password and confirmPassword must match'
            );
        }

        const saltRounds = this._configService.get('auth', {
            infer: true,
        }).saltRounds;
        const hash = await bcrypt.hash(user.password, saltRounds);

        let userEntity: IComplexUser;
        try {
            const emailEntity = await this._emailService.create(user.email);
            userEntity = await this._usersService.create({
                ...user,
                email: emailEntity,
                hashedPassword: hash,
            } as unknown as IComplexUser);

            await this.requestConfirmationMail(emailEntity.email);
        } catch (e) {
            throw new Error(e);
        }
        return await this.login(userEntity);
    }

    /**
     * Validates user credentials.
     *
     * @param {LoginUserDto} userDto - The user credentials to validate.
     * @returns {Promise<IAuthUser | null>} The authenticated user.
     * @throws {NotFoundException} If the user is not found.
     */
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

    /**
     * Logs in a user and generates an access token.
     *
     * @param {IUser} user - The user to log in.
     * @returns {Promise<IResponseAuthentication>} The login response, containing the access token.
     */
    async login(user: IUser): Promise<IResponseAuthentication> {
        return {
            access_token: this._jwtService.sign({
                username: user.username,
                id: user.id,
                role: (await this._usersService.findUser(user.id)).role,
            } as IUser),
        };
    }

    /**
     * Sends a confirmation mail to the given email or username.
     *
     * @param {string} value - The email or username to send the confirmation mail to.
     * @returns {Promise<void>} A promise indicating when the operation is complete.
     * @throws {NotFoundException} If no valid email is found for the given value.
     */
    async requestConfirmationMail(value: string) {
        const email = value.includes('@')
            ? value
            : (await this._usersService.findUserByUsername(value, true)).email
                  .email;

        if (!email) {
            throw new NotFoundException('No valid value for email was found!');
        }

        const payload = {
            email: email,
        } as object as IVerificationToken;

        const token = this._jwtService.sign(payload);

        await this._emailService.sendConfirmationMail(email, token);
    }

    /**
     * Confirms an email using the given token.
     *
     * @param {string} token - The token used to confirm the email.
     * @returns {Promise<IEmail>} The confirmed email.
     * @throws {BadRequestException} If the token is invalid or expired.
     */
    async confirmMail(token: string): Promise<IEmail> {
        try {
            const payload = await this._jwtService.verify(token);

            if (typeof payload === 'object' && 'email' in payload) {
                return this._emailService.setMailToConfirmed(payload.email);
            }
            throw new BadRequestException();
        } catch (error) {
            if (error?.name === 'TokenExpiredError') {
                throw new BadRequestException(
                    'Email confirmation token expired'
                );
            }
            throw new BadRequestException('Bad confirmation token');
        }
    }
}
