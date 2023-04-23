import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import {
    ActionExceptionType,
    ActionNotPerformedException,
    ActionObjectType,
    AppConfig,
    DuplicateSourceException,
} from '@rspd/shared/backend/utils';
import { Email } from '@rspd/user/backend/common-models';
import { Repository } from 'typeorm';

/**
 * Service for managing user emails.
 */
@Injectable()
export class UserMailService {
    /**
     * Constructor for UserMailService.
     * @constructor
     * @param {Repository<Email>} _emailRepository - TypeORM repository for the Email entity.
     * @param {MailerService} _mailerService - NestJS MailerService for sending emails.
     * @param {ConfigService<AppConfig>} _configService - NestJS ConfigService for application configuration.
     */
    constructor(
        @InjectRepository(Email)
        private readonly _emailRepository: Repository<Email>,
        private readonly _mailerService: MailerService,
        private readonly _configService: ConfigService<AppConfig>
    ) {}

    /**
     * Finds an email entity in the database by email address.
     * @async
     * @param {string} email - Email address to find.
     * @returns {Promise<Email>} Promise that resolves to the found Email entity.
     */
    async find(email: string): Promise<Email> {
        return await this._emailRepository.findOne({
            where: { email },
        });
    }

    /**
     * Creates an email entity in the database.
     * @async
     * @param {string} email - Email address to create.
     * @returns {Promise<Email>} Promise that resolves to the created Email entity.
     */
    async create(email: string): Promise<Email> {
        const emailEntity = await this.find(email);
        if (emailEntity) {
            throw new DuplicateSourceException('email');
        }

        return await this._emailRepository.save(
            this._emailRepository.create({
                email,
            })
        );
    }

    /**
     * Sends an email using the MailerService.
     * @async
     * @param {string} toEmail - Email address to send the email to.
     * @param {string} subject - Subject of the email.
     * @param {string} text - Text content of the email.
     * @param {string} html - HTML content of the email.
     * @returns {Promise<void>} Promise that resolves when the email is sent.
     */
    async sendMail(
        toEmail: string,
        subject: string,
        text: string,
        html: string
    ): Promise<void> {
        await this._mailerService.sendMail({
            to: toEmail,
            subject,
            text,
            html,
        });
    }

    /**
     * Sends a confirmation email to the specified email address.
     * @async
     * @param {string} email - Email address to send the confirmation email to.
     * @param {string} token - Token to include in the confirmation link.
     * @returns {Promise<void>} Promise that resolves when the email is sent.
     * @throws {BadRequestException} Throws a BadRequestException if the email is already confirmed.
     */
    async sendConfirmationMail(email: string, token: string): Promise<void> {
        if ((await this.find(email)).isEmailValidated == true) {
            throw new BadRequestException('Email already confirmed');
        }

        const url = this._configService.get('url');
        const port = this._configService.get('port');

        const linkUrl = `${url}:${port}/api/auth/confirmation-mail/${token}`;
        const text = `Welcome to the application. To confirm the email address, click here: ${linkUrl}`;
        const html = ` <p>Welcome to the application.</p>
                        <p>To confirm your email address, please click the link below:</p>
                        <a href='${linkUrl}'>${linkUrl}</a>`;
        await this.sendMail(email, 'Account Confirmation', text, html);
    }

    /**
     * Sets the isEmailValidated field of the specified email address to true.
     * @async
     * @param {string} email - Email address to set as validated.
     * @returns {Promise<Email>} Promise that resolves to the updated Email entity.
     * @throws {ActionNotPerformedException} Throws an ActionNotPerformedException if the email cannot be found in the database.
     */
    async setMailToConfirmed(email: string): Promise<Email> {
        const emailEntity = await this.find(email);

        if (!emailEntity) {
            throw new ActionNotPerformedException(
                ActionObjectType.EMAIL,
                email,
                ActionExceptionType.UPDATE
            );
        }

        return await this._emailRepository.save({
            ...emailEntity,
            isEmailValidated: true,
        });
    }
}
