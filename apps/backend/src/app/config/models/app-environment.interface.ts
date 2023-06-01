import { IsString } from 'class-validator';

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
	 * The url of the application.
	 * @type {string}
	 */
	APP_URL: string;

	/**
	 * The number of saltRounds used for hashing
	 * @type {string}
	 */
	AUTH_SALT_ROUNDS: string;

	/**
	 * The secret key for jwt
	 * @type {string}
	 */
	AUTH_SECRET_OR_KEY: string;

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

	/**
	 * The host of the Moodle API.
	 * @type {URL}
	 */
	MOODLE_HOST: string;

	/**
	 * The client id for the `Regensburg Student Progress Dashboard` application on GitHub.
	 * @type {string}
	 */
	GITHUB_OAUTH_CLIENT_ID: string;

	/**
	 * The client ID used to authenticate with the GitHub API.
	 *
	 * @type {string}
	 */
	GITHUB_OAUTH_CLIENT_SECRET: string;

	/** The email server host.
	 *
	 * @type {string}
	 */
	EMAIL_HOST: string;

	/**
	 * The email server port.
	 *
	 * @type {string}
	 */
	EMAIL_PORT: string;

	/**
	 * The email account username.
	 *
	 * @type {string}
	 */
	EMAIL_USER: string;

	/**
	 * The email account password.
	 *
	 * @type {string}
	 */
	EMAIL_PASSWORD: string;

	/**
	 * The email service provider (e.g. Gmail, Yahoo).
	 *
	 * @type {string}
	 */
	EMAIL_SERVICE: string;
}
