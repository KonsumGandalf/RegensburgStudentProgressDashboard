import { AppConfig } from '@rspd/shared/backend/utils';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { AppEnvironment } from '../models/app-environment.class';
import { IAppEnvironment } from '../models/app-environment.interface';

export abstract class ConfigUtils {
    static validateEnv(rawEnvironment: IAppEnvironment): AppConfig {
        const env = plainToInstance(AppEnvironment, rawEnvironment, {
            enableImplicitConversion: true
        });

        const config = ConfigUtils._createConfig(env);

        const configErrors = validateSync(config, {
            skipMissingProperties: false
        });

        if (configErrors.length > 0) {
            throw new Error(configErrors.toString());
        }

        return config;
    }

    private static _createConfig(environment: AppEnvironment): AppConfig {
        return plainToInstance(AppConfig, {
                port: environment.APP_PORT || 3333,
                url: environment.APP_URL,
                host: environment.APP_HOST || 'localhost',
                postgresDB: {
                    host: environment.POSTGRES_HOST || 'localhost',
                    port: environment.POSTGRES_PORT || 5432,
                    name: environment.POSTGRES_DB,
                    user: environment.POSTGRES_USER,
                    password: environment.POSTGRES_PASSWORD
                },
                moodle: {
                    username: environment.MOODLE_USER,
                    password: environment.MOODLE_PASSWORD,
                    service: environment.MOODLE_SERVICE,
                    host: environment.MOODLE_HOST
                },
                auth: {
                    secretOrKey: environment.AUTH_SECRET_OR_KEY,
                    saltRounds: environment.AUTH_SALT_ROUNDS
                },
                email: {
                    host: environment.EMAIL_HOST,
                    port: environment.EMAIL_PORT,
                    user: environment.EMAIL_USER,
                    password: environment.EMAIL_PASSWORD,
                    service: environment.EMAIL_SERVICE
                },
                github: {
                    clientId: environment.GITHUB_OAUTH_CLIENT_ID,
                    clientSecret: environment.GITHUB_OAUTH_CLIENT_SECRET
                }
            } as AppConfig,
            { enableImplicitConversion: true });
    }
}
