/**
 * Enumeration of host options for the application.
 * @enum {string}
 */
export enum HostEnum {
    /**
     * Use the Docker container's internal host address.
     * @type {string}
     */
    DOCKER = 'host.docker.internal',

    /**
     * Use the local machine's localhost address.
     * @type {string}
     */
    LOCALHOST = 'localhost',
}
