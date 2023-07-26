import { IsEmail, IsNumber, IsString } from 'class-validator';

/**
 * Represents the email configuration for a user.
 */
export class EmailConfig {
    /**
     * The email server host.
     *
     * @type {string}
     */
    @IsString()
    host: string;

    /**
     * The email server port.
     *
     * @type {number}
     */
    @IsNumber()
    port: number;

    /**
     * The email account username.
     *
     * @type {string}
     */
    @IsEmail()
    user: string;

    /**
     * The email account password.
     *
     * @type {string}
     */
    @IsString()
    password: string;

    /**
     * The email service provider (e.g. Gmail, Yahoo).
     *
     * @type {string}
     */
    @IsString()
    service: string;
}
