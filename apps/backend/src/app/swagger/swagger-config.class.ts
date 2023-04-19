import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../../../../../package.json');

export const registerSwagger = (app: INestApplication) => {
    const swaggerConfig = new DocumentBuilder()
        .setTitle('Rspd Api')
        .setDescription(
            'The api is constructed to communicate with the services of github and moodle ' +
                'which helps students and tutors to control progress and keep track of grades .'
        )
        .setVersion(version)
        .setLicense('MIT', 'http://mit.org')
        .addTag(
            'GITHUB',
            'all associated entry points are used by github to share new test results from student repositories'
        )
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('swagger', app, document);
};
