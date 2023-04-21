import { HostEnum } from '@rspd/shared/backend/utils';
import { IsEnum, IsNumber, IsString } from 'class-validator';

/**
 * An interface describing the environment variables used by the application.
 */
export class AppEnvironment {
    /**
     * The port number that the application should listen on.
     * @type {number}
     */
    @IsNumber()
    APP_PORT: number;

    /**
     * The number of saltRounds used for hashing
     * @type {string}
     */
    @IsNumber()
    AUTH_SALT_ROUNDS: number;

    /**
     * The secret key for jwt
     * @type {string}
     */
    @IsString()
    AUTH_SECRET_OR_KEY: string;

    /**
     * The host address that the application should use.
     * @type {HostEnum}
     */
    @IsEnum(HostEnum)
    APP_HOST: HostEnum;

    /**
     * The username to use for connecting to the PostgreSQL database.
     * @type {string}
     */
    @IsString()
    POSTGRES_USER: string;

    /**
     * The password to use for connecting to the PostgreSQL database.
     * @type {string}
     */
    @IsString()
    POSTGRES_PASSWORD: string;

    /**
     * The port number to use for connecting to the PostgreSQL database.
     * @type {string}
     */
    @IsNumber()
    POSTGRES_PORT: number;

    /**
     * The host address to use for connecting to the PostgreSQL database.
     * @type {HostEnum}
     */
    @IsEnum(HostEnum)
    POSTGRES_HOST: HostEnum;

    /**
     * The name of the PostgreSQL database to connect to.
     * @type {string}
     */
    @IsString()
    POSTGRES_DB: string;

    /**
     * The username to use for connecting to the Moodle service.
     * @type {string}
     */
    @IsString()
    MOODLE_USER: string;

    /**
     * The password to use for connecting to the Moodle service.
     * @type {string}
     */
    @IsString()
    MOODLE_PASSWORD: string;

    /**
     * The base URL of the Moodle service.
     * @type {string}
     */
    @IsString()
    MOODLE_SERVICE: string;
}
