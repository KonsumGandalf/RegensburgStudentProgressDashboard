/**
 * An interface describing the environment variables used by the application.
 */
export interface IAppEnvironment {
    /**
     * The port number that the application should listen on.
     * @type {string}
     */
    APP_PORT: string;

    /**
     * The host that the application should use.
     * @type {string}
     */
    APP_HOST: string;

    /**
     * The username to use for connecting to the PostgreSQL database.
     * @type {string}
     */
    POSTGRES_USER: string;

    /**
     * The password to use for connecting to the PostgreSQL database.
     * @type {string}
     */
    POSTGRES_PASSWORD: string;

    /**
     * The port number to use for connecting to the PostgreSQL database.
     * @type {string}
     */
    POSTGRES_PORT: string;

    /**
     * The host address to use for connecting to the PostgreSQL database.
     * @type {string}
     */
    POSTGRES_HOST: string;

    /**
     * The name of the PostgreSQL database to connect to.
     * @type {string}
     */
    POSTGRES_DB: string;

    /**
     * The username to use for connecting to the Moodle service.
     * @type {string}
     */
    MOODLE_USER: string;

    /**
     * The password to use for connecting to the Moodle service.
     * @type {string}
     */
    MOODLE_PASSWORD: string;

    /**
     * The base URL of the Moodle service.
     * @type {string}
     */
    MOODLE_SERVICE: string;
}
