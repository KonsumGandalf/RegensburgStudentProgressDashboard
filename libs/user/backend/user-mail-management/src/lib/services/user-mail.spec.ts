import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import {
    MockConfigService,
    MockRepository,
} from '@rspd/shared/backend/test-util';
import {
    ActionNotPerformedException,
    DuplicateSourceException,
} from '@rspd/shared/backend/utils';
import { Email } from '@rspd/user/backend/common-models';

import { UserMailService } from './user-mail.service';

describe('UserMailService', () => {
    let service: UserMailService;
    let mailerService: MailerService;
    let emailRepository: MockRepository;
    const emails: Email[] = [];
    let testEmailString: string;
    let configService: MockConfigService<string | number>;

    beforeEach(async () => {
        for (let i = 0; i < 3; i++) {
            emails.push({
                email: faker.internet.email(),
                isEmailValidated: false,
            } as Email);
        }
        testEmailString = emails[1].email;
        configService = new MockConfigService<string | number>({
            url: 'http://localhost',
            port: 4567,
        });

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserMailService,
                {
                    provide: ConfigService,
                    useValue: configService,
                },
                {
                    provide: getRepositoryToken(Email),
                    useClass: MockRepository,
                },
                {
                    provide: MailerService,
                    useValue: {
                        sendMail: jest.fn(
                            async (
                                to: string,
                                subject: string,
                                text: string,
                                html: string
                            ) => {
                                return {
                                    to,
                                    subject,
                                    text,
                                    html,
                                };
                            }
                        ),
                    },
                },
            ],
        }).compile();

        service = module.get(UserMailService);
        emailRepository = module.get(getRepositoryToken(Email));
        emailRepository.entities = emails;
        mailerService = module.get(MailerService);
    });

    it('should check if the service is defined', () => {
        expect(service).toBeDefined();
    });

    describe('find', () => {
        it('should find the email entity in the database', async () => {
            const result = await service.find(testEmailString);

            expect(result).toEqual(emails[1]);
        });
    });

    describe('create', () => {
        it('should create an email entity, save and return it', async () => {
            const email = 'test@example.com';
            const result = await service.create(email);

            expect(result.email).toBe(email);
        });

        it('should throw a `DuplicateSourceException` in case an email is already registered', async () => {
            const email = 'test3@example.com';
            await service.create(email);

            await expect(service.create(email)).rejects.toThrowError(
                DuplicateSourceException
            );
        });
    });

    describe('sendMail', () => {
        it('should send an email using the MailerService', async () => {
            const toEmail = 'test@example.com';
            const subject = 'Test Email';
            const text = 'This is a test email.';
            const html = '<p>This is a test email.</p>';

            const sendMailSpy = jest.spyOn(mailerService, 'sendMail');

            await service.sendMail(toEmail, subject, text, html);

            expect(sendMailSpy).toHaveBeenCalledWith({
                to: toEmail,
                subject,
                text,
                html,
            });
        });
    });

    describe('sendConfirmationMail', () => {
        it('should send an email with confirmation link', async () => {
            const token = 'abed1234';
            const confirmationLink = `${configService.get(
                'url'
            )}:${configService.get(
                'port'
            )}/api/auth/confirmation-mail/${token}`;
            const expectedText = `Welcome to the application. To confirm the email address, click here: ${confirmationLink}`;
            const expectedHtml = ` <p>Welcome to the application.</p>
                        <p>To confirm your email address, please click the link below:</p>
                        <a href='${confirmationLink}'>${confirmationLink}</a>`;
            const sendMailSpy = jest.spyOn(service, 'sendMail');

            await service.sendConfirmationMail(testEmailString, token);

            expect(sendMailSpy).toHaveBeenCalledWith(
                testEmailString,
                'Account Confirmation',
                expectedText,
                expectedHtml
            );
        });

        it('should throw BadRequestException if email is already confirmed', async () => {
            emails[1].isEmailValidated = true;
            const testString = emails[1].email;

            await expect(
                service.sendConfirmationMail(testString, 'wrong')
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('setMailToConfirmed', () => {
        it('should set isEmailValidated field to true for an existing email', async () => {
            const emailEntity = emails[1];

            const findSpy = jest
                .spyOn(service, 'find')
                .mockResolvedValueOnce(emailEntity);

            const result = await service.setMailToConfirmed(emailEntity.email);

            expect(findSpy).toHaveBeenCalledWith(emailEntity.email);
            expect(result).toEqual(
                expect.objectContaining({
                    email: emailEntity.email,
                    isEmailValidated: true,
                })
            );
        });

        it('should throw an ActionNotPerformedException for a non-existing email', async () => {
            await expect(
                service.setMailToConfirmed('not_found')
            ).rejects.toThrow(ActionNotPerformedException);
        });
    });
});
