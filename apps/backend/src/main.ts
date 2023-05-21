/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppConfig } from '@rspd/shared/backend/utils';

import { AppModule } from './app/app.module';
import { AllExceptionsFilter } from './app/exceptions/exception.filter';
import { registerSession } from './app/session/session-config.class';
import { registerSwagger } from './app/swagger/swagger-config.class';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const globalPrefix = 'api';
	app.setGlobalPrefix(globalPrefix);
	const configService = app.get(ConfigService<AppConfig>);
	const port = configService.get<number>('port') || 3000;
	const secret = configService.get('auth', { infer: true }).secretOrKey;

	registerSwagger(app);
	registerSession(app, secret);

	const { httpAdapter } = app.get(HttpAdapterHost);
	app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

	await app.listen(port);
	Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
