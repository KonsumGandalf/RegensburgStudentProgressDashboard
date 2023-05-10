import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RESOURCE_PROVIDER_TOKEN, ResourceProvider } from '@rspd/shared/backend/utils';
import { Submission } from '@rspd/student-submissions/backend/common-models';
import { RspdUserModule } from '@rspd/user/backend/user-management';

import { SubmissionController } from './controller/submission.controller';
import { SubmissionService } from './services/submission.service';

@Module({
	imports: [RspdUserModule, TypeOrmModule.forFeature([Submission])],
	controllers: [SubmissionController],
	providers: [
		SubmissionService,
		{
			useClass: SubmissionService,
			provide: RESOURCE_PROVIDER_TOKEN(ResourceProvider.SUBMISSION),
		},
	],
	exports: [RspdSubmissionManagementModule],
})
export class RspdSubmissionManagementModule {}
