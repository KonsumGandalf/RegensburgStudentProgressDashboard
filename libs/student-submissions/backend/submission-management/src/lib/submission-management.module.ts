import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RspdChallengeManagementModule } from '@rspd/challenge-management/backend/challenge-management';
import { RESOURCE_PROVIDER_TOKEN, ResourceProvider } from '@rspd/shared/backend/utils';
import {
	AssignmentSubmission,
	ChallengeSubmission,
} from '@rspd/student-submissions/backend/common-models';

import { AssignmentSubmissionService } from './services/assignment-submission.service';
import { ChallengeSubmissionService } from './services/challenge-submission.service';
import { SubmissionService } from './services/submission.service';

@Module({
	imports: [
		RspdChallengeManagementModule,
		TypeOrmModule.forFeature([AssignmentSubmission, ChallengeSubmission]),
	],
	controllers: [],
	providers: [
		{
			useClass: SubmissionService,
			provide: RESOURCE_PROVIDER_TOKEN(ResourceProvider.SUBMISSION),
		},
		ChallengeSubmissionService,
		AssignmentSubmissionService,
	],
	exports: [
		RspdSubmissionManagementModule,
		AssignmentSubmissionService,
		ChallengeSubmissionService,
	],
})
export class RspdSubmissionManagementModule {}
