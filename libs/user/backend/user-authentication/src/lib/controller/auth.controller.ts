import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Role, RoleGuard, UserRole } from '@rspd/shared/backend/utils';
import { IEmail, IUser } from '@rspd/user/backend/common-models';
import { IRequestLogin } from '@rspd/user/backend/common-models';

import { LoginUserDto } from '../models/dtos/login-user.dto';
import { RegisterUserDto } from '../models/dtos/register-user.dto';
import { LocalAuthGuard } from '../models/guards/local-auth.guard';
import { IAuthJwt } from '../models/interfaces/auth-jwt.interface';
import { IResponseAuthentication } from '../models/interfaces/response-login.interfaces';
import { AuthService } from '../services/auth.service';

/**
 * Controller for handling authentication related requests.
 */
@ApiTags('auth')
@Controller()
export class AuthController {
	constructor(private readonly _authService: AuthService) {}

	/**
	 * Register a new user.
	 * @async
	 * @function
	 * @param {RegisterUserDto} userDto - User registration details.
	 * @returns {Promise<IResponseAuthentication>} Promise resolving to a response object containing a JWT token.
	 */
	@Post('register')
	async register(@Body() userDto: RegisterUserDto): Promise<IResponseAuthentication> {
		return await this._authService.register(userDto);
	}

	/**
	 * Authenticates a user with the LocalAuthStrategy.
	 * @async
	 * @function
	 * @param {LoginUserDto} request - Requirements for the user to login, however this is used by the LocalAuthGuard, this is mainly named for Swagger Documentation purposes!
	 * @param {IRequestLogin} request - User authentication details.
	 * @param userDto
	 * @returns {Promise<IResponseAuthentication>} Promise resolving to a response object containing a JWT token.
	 */
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(
		@Request() request: IRequestLogin,
		@Body() userDto: LoginUserDto,
	): Promise<IResponseAuthentication> {
		return await this._authService.login({
			username: request.user.username,
			id: request.user.id,
		} as IUser);
	}

	/**
	 * Get the current logged-in user.
	 * @async
	 * @function
	 * @param {IAuthJwt} req - User authentication details.
	 * @returns {Promise<IUser>} Promise resolving to the current logged-in user object.
	 */
	@Role(UserRole.TUTOR)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Get('whoami')
	async whoami(@Request() req: IAuthJwt) {
		return req.user;
	}

	/**
	 * Request a confirmation email.
	 * @async
	 * @function
	 * @param {IAuthJwt} req - User authentication details.
	 * @returns {Promise<void>} Promise resolving to void.
	 */
	@UseGuards(JwtAuthGuard)
	@Post('confirmation-mail')
	async requestConfirmation(@Request() req: IAuthJwt): Promise<void> {
		await this._authService.requestConfirmationMail(req.user.username);
	}

	/**
	 * Confirm an email.
	 * @async
	 * @function
	 * @param {string} token - Email confirmation token.
	 * @returns {Promise<IEmail>} Promise resolving to an email object.
	 */
	@Get('confirmation-mail/:token')
	async confirmMail(@Param('token') token: string): Promise<IEmail> {
		return await this._authService.confirmMail(token);
	}
}
