import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SemesterService } from '@rspd/challenge-management/backend/semester-management';
import { MoodleManagementService } from '@rspd/moodle-management/backend/moodle-management';
import { IAppConfig } from '@rspd/shared/backend/utils';
import { IComplexUser, IEmail, IUser, Student, Tutor } from '@rspd/user/backend/common-models';
import { UserMailService } from '@rspd/user/backend/user-mail-management';
import { TutorService, UserService } from '@rspd/user/backend/user-management';
import { StudentService } from '@rspd/user/backend/user-management';
import {
	ICheckAvailability,
	IResponseAuthentication,
	IUserIntermediate,
} from '@rspd/user/common/models';
import * as bcrypt from 'bcrypt';

import { LoginUserDto } from '../models/dtos/login-user.dto';
import { RegisterUserDto } from '../models/dtos/register-user.dto';
import { IAuthUser } from '../models/interfaces/auth-user.interface';
import { IVerificationToken } from '../models/interfaces/verfication-token-email.interface';

/**
 * Service responsible for handling user authentication-related tasks.
 */
@Injectable()
export class AuthService {
	constructor(
		private readonly _studentService: StudentService,
		private readonly _tutorService: TutorService,
		private readonly _userService: UserService,
		private readonly _emailService: UserMailService,
		private readonly _configService: ConfigService<IAppConfig>,
		private readonly _jwtService: JwtService,
		private readonly _moodleManagementService: MoodleManagementService,
		private readonly _semesterService: SemesterService,
	) {}

	/**
	 * Registers a new user.
	 *
	 * @param {RegisterUserDto} user - The user to register.
	 * @returns {Promise<IResponseAuthentication>} The registered user.
	 * @throws {DuplicateSourceException} If the username or email already exists.
	 * @throws {Error} If any other error occurs.
	 */
	async register(user: RegisterUserDto): Promise<IResponseAuthentication> {
		const saltRounds = this._configService.get('auth', {
			infer: true,
		}).saltRounds;
		const hash = await bcrypt.hash(user.password, saltRounds);

		let userEntity: IComplexUser;
		try {
			const emailEntity = await this._emailService.create(user.email);
			if (user.username.includes('admin')) {
				userEntity = await this._tutorService.create({
					...user,
					email: emailEntity,
					hashedPassword: hash,
				} as unknown as Tutor);
			} else {
				const currentSemester = await this._semesterService.getCurrentSemester();
				userEntity = await this._studentService.create({
					...user,
					email: emailEntity,
					hashedPassword: hash,
					semester: currentSemester,
				} as unknown as Student);
			}

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
	async validateUserCredentials(userDto: LoginUserDto): Promise<IAuthUser | null> {
		const user = await this._userService.findUserByUsername(userDto.username);
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
		const tokenExpirationDate = new Date();
		tokenExpirationDate.setMinutes(tokenExpirationDate.getMinutes() + 45);
		return {
			access_token: this._jwtService.sign({
				username: user.username,
				id: user.id,
				role: (await this._userService.findOneById(user.id)).role,
			} as IUser),
			tokenExpirationDate,
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
			: (await this._userService.findUserByUsername(value)).email.email;

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
				const moodleId = await this._moodleManagementService
					.getUserByEmail(payload.email)
					.then((user) => user.id);
				await this._studentService.addMoodleIdToStudent(moodleId, payload.email);

				return this._emailService.setMailToConfirmed(payload.email);
			}
			throw new BadRequestException();
		} catch (error) {
			if (error?.name === 'TokenExpiredError') {
				throw new BadRequestException('Email confirmation token expired');
			}
			throw new BadRequestException('Bad confirmation token');
		}
	}

	async checkSourceAvailability(source: ICheckAvailability): Promise<boolean> {
		let availability = false;
		if (source.email) {
			const mail = await this._emailService.findOptions({
				where: { email: source.email },
			});
			if (source.confirmedMail) {
				availability = mail.isEmailValidated;
			} else {
				availability = !!mail;
			}
		}
		if (source.username) {
			availability = !!(await this._userService.findUserByUsername(source.username));
		}
		return availability;
	}

	async getUser(username: string): Promise<IUserIntermediate> {
		const response = await this._userService.findUserByUsername(username);
		return {
			email: response.email.email.toString(),
			username: response.username,
			firstName: response.firstName,
			lastName: response.lastName,
		};
	}
}
