import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RspdSemesterManagementModule } from '@rspd/challenge-management/backend/semester-management';
import { RspdMoodleManagementModule } from '@rspd/moodle-management/backend/moodle-management';
import { IAppConfig, JwtStrategy } from '@rspd/shared/backend/utils';
import { RspdGithubAuthorizationModule } from '@rspd/user/backend/github-authorization';
import { RspdUserMailManagementModule } from '@rspd/user/backend/user-mail-management';
import { RspdUserModule } from '@rspd/user/backend/user-management';

import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
	imports: [
		RspdUserModule,
		RspdMoodleManagementModule,
		RspdUserMailManagementModule,
		RspdSemesterManagementModule,
		RspdGithubAuthorizationModule,
		PassportModule.register({ session: true, defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService<IAppConfig>) => ({
				secret: configService.get('auth', { infer: true }).secretOrKey,
				signOptions: {
					expiresIn: '45m',
				},
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	exports: [RspdAuthModule],
})
export class RspdAuthModule {
	static register(options: Pick<DynamicModule, 'imports'>): DynamicModule {
		return {
			module: RspdAuthModule,
			imports: options.imports,
		};
	}
}
