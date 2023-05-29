import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { SemesterService } from '@rspd/challenge-management/backend/semester-management';
import { MoodleManagementService } from '@rspd/moodle-management/backend/moodle-management';
import { MockConfigService } from '@rspd/shared/backend/test-util';
import { AuthConfig } from '@rspd/shared/backend/utils';
import { IComplexUser, Mail, Student, User } from '@rspd/user/backend/common-models';
import { UserMailService } from '@rspd/user/backend/user-mail-management';
import { StudentService, TutorService, UserService } from '@rspd/user/backend/user-management';
import { IResponseAuthentication, IUserIntermediate } from '@rspd/user/common/models';

import { LoginUserDto } from '../models/dtos/login-user.dto';
import { RegisterUserDto } from '../models/dtos/register-user.dto';
import { IAuthUser } from '../models/interfaces/auth-user.interface';
import { AuthService } from './auth.service';

describe('AuthService', () => {
	let authService: AuthService;
	let userService: UserService;
	let studentService: StudentService;
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
					provide: UserService,
					useValue: {
						findUserByUsername: jest.fn().mockImplementation((arg: any) => arg),
					},
				},
				{
					provide: StudentService,
					useValue: {
						create: jest.fn().mockImplementation((arg: any) => arg),
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
				{
					provide: MoodleManagementService,
					useValue: {
						getUserByEmail: jest.fn().mockImplementation((arg: any) => {
							return {
								id: 1,
							};
						}),
					},
				},
				{
					provide: SemesterService,
					useValue: {
						getCurrentSemester: jest.fn().mockResolvedValue({
							start: new Date('2023-09-01'),
							end: new Date('2024-03-01'),
						}),
					},
				},
			],
		}).compile();

		authService = module.get(AuthService);
		emailService = module.get(UserMailService);
		userService = module.get(UserService);
		studentService = module.get(StudentService);
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
				email: 'test-user@example.com',
				username: 'test-user',
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
				tokenExpirationDate: new Date(),
			} as IResponseAuthentication;
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
			jest.spyOn(userService, 'findUserByUsername').mockResolvedValueOnce(
				user.user as Student,
			);

			const result = await authService.validateUserCredentials(userDto);

			expect(userService.findUserByUsername).toHaveBeenCalledWith(username);
			expect(result).toEqual(user);
		});

		it('should throw NotFoundException if the user is not found', async () => {
			const username = 'testuser';
			const password = 'password';
			const userDto: LoginUserDto = { username, password };
			jest.spyOn(userService, 'findUserByUsername').mockResolvedValueOnce(null);

			await expect(authService.validateUserCredentials(userDto)).rejects.toThrowError(
				NotFoundException,
			);
			expect(userService.findUserByUsername).toHaveBeenCalledWith(username);
		});
	});

	describe('requestConfirmationMail', () => {
		it('should throw NotFoundException if no email is found', async () => {
			const findUserByUsernameSpy = jest
				.spyOn(userService, 'findUserByUsername')
				.mockResolvedValueOnce({
					email: {
						email: null,
					} as Mail,
				} as Student);

			await expect(authService.requestConfirmationMail('test-user')).rejects.toThrow(
				NotFoundException,
			);
			expect(findUserByUsernameSpy).toHaveBeenCalledWith('test-user');
		});

		it('should call emailService.sendConfirmationMail with the email and token', async () => {
			const email = 'test-user@example.com';

			jest.spyOn(userService, 'findUserByUsername').mockResolvedValueOnce({
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
