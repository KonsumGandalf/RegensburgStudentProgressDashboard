import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IComplexUser } from '@rspd/user/backend/user-management';
import * as bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';

import { LoginUserDto } from '../models/dtos/login-user.dto';
import { AuthService } from '../services/auth.service';

/**
 * Local strategy implementation for passport.js.
 * Authenticates users based on username and password.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    /**
     * Creates an instance of LocalStrategy.
     * @param {AuthService} authService - An instance of AuthService to use for user authentication.
     */
    constructor(private readonly authService: AuthService) {
        super();
    }

    /**
     * Validates a user's credentials and returns the user if valid.
     * @param {string} username - The username of the user to validate.
     * @param {string} password - The password of the user to validate.
     * @returns {Promise<IComplexUser>} A Promise that resolves to the validated user.
     * @throws {UnauthorizedException} If the password is incorrect.
     */
    async validate(username: string, password: string): Promise<IComplexUser> {
        const user = await this.authService.validateUserCredentials({
            username: username,
            password: password,
        } as LoginUserDto);
        if (!(await bcrypt.compare(user.password, user.user.hashedPassword))) {
            throw new UnauthorizedException('Wrong password');
        }

        return user.user as IComplexUser;
    }
}
