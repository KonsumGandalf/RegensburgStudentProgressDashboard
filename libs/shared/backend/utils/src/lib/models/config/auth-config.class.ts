import { IsNumber, IsString } from 'class-validator';

/**
 * Configuration for Moodle integration.
 */
export class AuthConfig {
    /**
     * The number of saltRounds used for hashing
     * @type {number}
     */
    @IsNumber()
    saltRounds: number;

    /**
     * The secret key for jwt
     * @type {string}
     */
    @IsString()
    secretOrKey: string;
}
