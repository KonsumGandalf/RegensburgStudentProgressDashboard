import { IsString } from 'class-validator';

/**
 * Configuration for Moodle integration.
 */
export class MoodleConfig {
    /**
     * The username to use for authentication with the Moodle API.
     * @type {string}
     */
    @IsString()
    username: string;

    /**
     * The password to use for authentication with the Moodle API.
     * @type {string}
     */
    @IsString()
    password: string;

    /**
     * The service to use for authentication with the Moodle API.
     * @type {string}
     */
    @IsString()
    service: string;
}
