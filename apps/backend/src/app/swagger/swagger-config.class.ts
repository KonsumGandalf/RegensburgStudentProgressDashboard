import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../../../../../package.json');

export const registerSwagger = (app: INestApplication) => {
	const swaggerConfig = new DocumentBuilder()
		.setTitle('Rspd Api')
		.setDescription(
			'The api is constructed to communicate with the services of github and moodle ' +
				'which helps students and tutors to control progress and keep track of grades .',
		)
		.setVersion(version)
		.setLicense('MIT', 'http://mit.org')
		.addBearerAuth()
		.addTag('challenge', 'allows CRUD actions for Tutors')
		.addTag('assignment', 'allows CRUD actions for Tutors')
		.build();

	const document = SwaggerModule.createDocument(app, swaggerConfig);

	SwaggerModule.setup('swagger', app, document);
};
