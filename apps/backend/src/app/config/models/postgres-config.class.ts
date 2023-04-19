import { IsEnum, IsNumber, IsString } from 'class-validator';

import { HostEnum } from './host.enum';

/**
 * Configuration for connecting to a PostgreSQL database.
 */
export class PostgresConfig {
    /**
     * The username to use for connecting to the database.
     * @type {string}
     */
    @IsString()
    user: string;

    /**
     * The password to use for connecting to the database.
     * @type {string}
     */
    @IsString()
    password: string;

    /**
     * The port number to use for connecting to the database.
     * @type {number}
     */
    @IsNumber()
    port: number;

    /**
     * The host address to use for connecting to the database.
     * @type {HostEnum}
     */
    @IsEnum(HostEnum)
    host: HostEnum;

    /**
     * The name of the database to connect to.
     * @type {string}
     */
    @IsString()
    name: string;
}
