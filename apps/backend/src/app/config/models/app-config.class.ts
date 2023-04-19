import { Type } from 'class-transformer';
import { IsEnum, IsNumber, ValidateNested } from 'class-validator';

import { HostEnum } from './host.enum';
import { MoodleConfig } from './moodle-config.class';
import { PostgresConfig } from './postgres-config.class';

/**
 * Configuration for the application.
 */
export class AppConfig {
    /**
     * The port number that the application should listen on.
     * @type {number}
     */
    @IsNumber()
    port: number;

    /**
     * The host address that the application should use.
     * @type {HostEnum}
     */
    @IsEnum(HostEnum)
    host: HostEnum;

    /**
     * The configuration for connecting to the application's database.
     * @type {PostgresConfig}
     */
    @ValidateNested()
    @Type(() => PostgresConfig)
    postgresDB: PostgresConfig;

    /**
     * The configuration for connecting to the Moodle service.
     * @type {MoodleConfig}
     */
    @ValidateNested()
    @Type(() => MoodleConfig)
    moodle: MoodleConfig;
}
