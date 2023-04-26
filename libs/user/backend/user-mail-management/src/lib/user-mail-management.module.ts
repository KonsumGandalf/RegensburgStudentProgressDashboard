import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { IAppConfig } from '@rspd/shared/backend/utils';
import { Mail } from '@rspd/user/backend/common-models';

import { UserMailController } from './controller/user-mail.controller';
import { UserMailService } from './services/user-mail.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Mail]),
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService<IAppConfig>) => {
				const emailConfig = configService.get('email', { infer: true });
				console.log(emailConfig);

				return {
					transport: {
						host: 'smtp-mail.outlook.com',
						port: 587,
						secure: false, // does NOT mean its unsecure!
						service: 'outlook',
						auth: {
							user: 'regensburg-student-progress-dashboard@outlook.com',
							pass: 'testing-david-2004!',
						},
						tls: {
							ciphers: 'SSLv3',
						},
					},
					defaults: {
						from: '"Regensburg Student Progress Dashboard" <regensburg-student-progress-dashboard@outlook.com>',
					},
					template: {
						dir: process.cwd() + '/templates/',
						adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
						options: {
							strict: true,
						},
					},
				};
			},
			inject: [ConfigService],
		}),
	],
	controllers: [UserMailController],
	providers: [UserMailService],
	exports: [RspdUserMailManagementModule, UserMailService],
})
export class RspdUserMailManagementModule {}
