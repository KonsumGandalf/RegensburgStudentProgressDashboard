import { AuthConfig } from './auth-config.class';
import { EmailConfig } from './email-config.class';
import { HostEnum } from './host.enum';
import { MoodleConfig } from './moodle-config.class';
import { PostgresConfig } from './postgres-config.class';

export interface IAppConfig {
    /**
     * The port number that the application should listen on.
     * @type {number}
     */
    port: number;

    /**
     * The url of the application.
     * @type {string}
     */
    url: string;

    /**
     * The host address that the application should use.
     * @type {HostEnum}
     */
    host: HostEnum;

    /**
     * The configuration for the authentication service.
     * @type {AuthConfig}
     */
    auth: AuthConfig;

    /**
     * The configuration for connecting to the application's database.
     * @type {PostgresConfig}
     */
    postgresDB: PostgresConfig;

    /**
     * The configuration for connecting to the Moodle service.
     * @type {MoodleConfig}
     */
    moodle: MoodleConfig;

    /**
     * The configuration for connecting to the Email service.
     * @type {EmailConfig}
     */
    email: EmailConfig;
}
