import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import {
    JwtAuthGuard,
    Role,
    RoleGuard,
    UserRole,
} from '@rspd/shared/backend/utils';
import { IEmail, IUser } from '@rspd/user/backend/common-models';

import { RegisterUserDto } from '../models/dtos/register-user.dto';
import { LocalAuthGuard } from '../models/guards/local-auth.guard';
import { IAuthJwt } from '../models/interfaces/auth-jwt.interface';
import { IRequestLogin } from '../models/interfaces/request-login.interface';
import { IResponseAuthentication } from '../models/interfaces/response-login.interfaces';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {
    /**
     * Constructor for AuthController.
     * @param _authService - Instance of AuthService.
     */
    constructor(private readonly _authService: AuthService) {}

    /**
     * Register a new user.
     * @param userDto - User registration details.
     * @returns Promise resolving to a response object containing a JWT token.
     */
    @Post('/register')
    register(
        @Body() userDto: RegisterUserDto
    ): Promise<IResponseAuthentication> {
        return this._authService.register(userDto);
    }

    /**
     * Authenticate a user.
     * @param request - User authentication details.
     * @returns Promise resolving to a response object containing a JWT token.
     */
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(
        @Request() request: IRequestLogin
    ): Promise<IResponseAuthentication> {
        return await this._authService.login({
            username: request.user.username,
            id: request.user.id,
        } as IUser);
    }

    /**
     * Get current logged-in user.
     * @param req - User authentication details.
     * @returns Promise resolving to the current logged-in user object.
     */
    @Role(UserRole.TUTOR)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get('whoami')
    async whoami(@Request() req: IAuthJwt) {
        return req.user;
    }

    /**
     * Request confirmation email.
     * @param req - User authentication details.
     * @returns Promise resolving to void.
     */
    @UseGuards(JwtAuthGuard)
    @Post('confirmation-mail')
    async requestConfirmation(@Request() req: IAuthJwt) {
        await this._authService.requestConfirmationMail(req.user.username);
    }

    /**
     *
     * @todo later must be @PUT!
     *
     * Confirm email.
     * param token - Email confirmation token.
     * @returns Promise resolving to an email object.
     */
    @Get('confirmation-mail/:id')
    async confirmMail(@Param('id') token: string): Promise<IEmail> {
        return await this._authService.confirmMail(token);
    }
}
