import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MockConfigService } from '@rspd/shared/backend/test-util';
import { AuthConfig } from '@rspd/shared/backend/utils';
import { IComplexUser, Mail, Student, User } from '@rspd/user/backend/common-models';
import { UserMailService } from '@rspd/user/backend/user-mail-management';
import { StudentService, TutorService } from '@rspd/user/backend/user-management';

import { LoginUserDto } from '../models/dtos/login-user.dto';
import { RegisterUserDto } from '../models/dtos/register-user.dto';
import { IAuthUser } from '../models/interfaces/auth-user.interface';
import { AuthService } from './auth.service';

describe('AuthService', () => {
	let authService: AuthService;
	let studentService: StudentService;
	let tutorService: TutorService;
	let emailService: UserMailService;
	let configService: MockConfigService<AuthConfig>;

	beforeEach(async () => {
		configService = new MockConfigService<AuthConfig>({
			auth: {
				saltRounds: 1,
				secretOrKey: 'test',
			},
		});

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: ConfigService,
					useValue: configService,
				},
				{
					provide: JwtService,
					useValue: {
						sign: jest.fn(),
						verify: jest.fn().mockImplementation((token: string) => {
							return token;
						}),
					},
				},
				{
					provide: StudentService,
					useValue: {
						create: jest.fn().mockImplementation((arg: any) => arg),
						findUserByUsername: jest.fn().mockImplementation((arg: any) => arg),
					},
				},
				{
					provide: TutorService,
					useValue: {
						create: jest.fn().mockImplementation((arg: any) => arg),
					},
				},
				{
					provide: UserMailService,
					useValue: {
						sendConfirmationMail: jest.fn().mockImplementation((arg: any) => arg),
						confirmMail: jest.fn().mockImplementation((arg: any) => arg),
						create: jest.fn().mockImplementation((arg: any) => arg),
					},
				},
			],
		}).compile();

		authService = module.get(AuthService);
		emailService = module.get(UserMailService);
		studentService = module.get(StudentService);
		tutorService = module.get(TutorService);
	});

	it('should check if the authService is defined', () => {
		expect(authService).toBeDefined();
	});

	describe('register', () => {
		it('should create a new user and return the user object', async () => {
			// Arrange
			const user: RegisterUserDto = {
				firstName: 'John',
				lastName: 'Doe',
				email: 'johndoe@example.com',
				username: 'johndoe',
				password: 'secret',
			};
			const hash = 'hashed-password';
			const userEntity = {
				...user,
				hashedPassword: hash,
			} as unknown as Student;
			const emailEntity = {
				email: user.email,
			} as unknown as Mail;
			const response = {
				access_token: 'token.test',
			};
			const createEmailSpy = jest
				.spyOn(emailService, 'create')
				.mockResolvedValueOnce(emailEntity);
			const createSpy = jest
				.spyOn(studentService, 'create')
				.mockResolvedValueOnce(userEntity);
			const requestConfirmationMailSpy = jest
				.spyOn(authService, 'requestConfirmationMail')
				.mockResolvedValueOnce(undefined);
			const loginSpy = jest.spyOn(authService, 'login').mockResolvedValueOnce(response);

			// Act
			const result = await authService.register(user);

			// Assert
			expect(result).toEqual(response);
			expect(createEmailSpy).toHaveBeenCalledWith(user.email);
			expect(loginSpy).toHaveBeenCalledWith(expect.objectContaining(user));
			expect(createSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					...user,
					email: emailEntity,
				} as unknown as IComplexUser),
			);
			expect(requestConfirmationMailSpy).toHaveBeenCalledWith(user.email);
		});
	});

	describe('validateUserCredentials', () => {
		it('should return the user if the credentials are valid', async () => {
			const username = 'testuser';
			const password = 'password';
			const userDto: LoginUserDto = { username, password };
			const user: IAuthUser = {
				user: {
					id: '1',
					username,
					hashedPassword: 'hashed_password',
					email: {
						id: '1',
						email: 'testuser@example.com',
					} as unknown as Mail,
				} as unknown as User,
				password,
			};
			jest.spyOn(studentService, 'findUserByUsername').mockResolvedValueOnce(
				user.user as Student,
			);

			const result = await authService.validateUserCredentials(userDto);

			expect(studentService.findUserByUsername).toHaveBeenCalledWith(username);
			expect(result).toEqual(user);
		});

		it('should throw NotFoundException if the user is not found', async () => {
			const username = 'testuser';
			const password = 'password';
			const userDto: LoginUserDto = { username, password };
			jest.spyOn(studentService, 'findUserByUsername').mockResolvedValueOnce(null);

			await expect(authService.validateUserCredentials(userDto)).rejects.toThrowError(
				NotFoundException,
			);
			expect(studentService.findUserByUsername).toHaveBeenCalledWith(username);
		});
	});

	describe('requestConfirmationMail', () => {
		it('should throw NotFoundException if no email is found', async () => {
			const findUserByUsernameSpy = jest
				.spyOn(studentService, 'findUserByUsername')
				.mockResolvedValueOnce({
					email: {
						email: null,
					} as Mail,
				} as Student);

			await expect(authService.requestConfirmationMail('johndoe')).rejects.toThrow(
				NotFoundException,
			);
			expect(findUserByUsernameSpy).toHaveBeenCalledWith('johndoe');
		});

		it('should call emailService.sendConfirmationMail with the email and token', async () => {
			const email = 'johndoe@example.com';

			jest.spyOn(studentService, 'findUserByUsername').mockResolvedValueOnce({
				email: {
					email: email,
				} as Mail,
			} as Student);

			const sendConfirmationMailSpy = jest
				.spyOn(emailService, 'sendConfirmationMail')
				.mockResolvedValueOnce();

			await authService.requestConfirmationMail(email);

			expect(sendConfirmationMailSpy).toHaveBeenCalledTimes(1);
		});
	});
});
