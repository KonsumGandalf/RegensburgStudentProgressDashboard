import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE, RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RspdAuthModule } from '@rspd/auth/backend/auth';
import { RspdGradeModule } from '@rspd/challenge-management/backend/challenge-management';
import { AppConfig } from '@rspd/shared/backend/utils';
import { RspdUserModule } from '@rspd/user/backend/user';

import { ConfigUtils } from './config/util/config.utils';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [
                'apps/api/.env.local',
                'apps/api/.env.development',
                'apps/api/.env.test',
            ],
            validate: ConfigUtils.validateEnv,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService<AppConfig>) => {
                const postgresDB = config.get('postgresDB', { infer: true });

                return {
                    type: 'postgres',
                    database: postgresDB.name,
                    host: postgresDB.host,
                    username: postgresDB.user,
                    port: postgresDB.port,
                    password: postgresDB.password,
                    autoLoadEntities: true,
                    synchronize: true,
                };
            },
        }),

        RouterModule.register([
            {
                path: 'challenge',
                module: RspdGradeModule,
            },
            {
                path: 'user',
                module: RspdUserModule,
            },
            {
                path: 'auth',
                module: RspdAuthModule,
            },
        ]),

        RspdGradeModule,
        RspdAuthModule,
        RspdUserModule,
    ],
    providers: [
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                whitelist: true,
            }),
        },
    ],
})
export class AppModule {}
