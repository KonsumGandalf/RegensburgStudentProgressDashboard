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
		.addTag('auth', 'Controller for handling authentication related requests.')
		.addTag('github-submission', 'Controller for handling GitHub submissions.')
		.addTag('moodle-submission', 'Controller for handling Moodle submission-related endpoints.')
		.addTag(
			'student-submission',
			'Controller for requesting insight information about the students progress in challenges.',
		)
		.build();

	const document = SwaggerModule.createDocument(app, swaggerConfig);

	SwaggerModule.setup('swagger', app, document);
};
