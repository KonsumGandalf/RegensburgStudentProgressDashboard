import { Module } from '@nestjs/common';
import { RspdChallengeManagementModule } from '@rspd/challenge-management/backend/challenge-management';
import { RspdGithubSubmissionModule } from '@rspd/student-submissions/backend/github-submissions';
import { RspdSubmissionManagementModule } from '@rspd/student-submissions/backend/submission-management';
import { RspdUserModule } from '@rspd/user/backend/user-management';

import { StudentSubmissionInsightsController } from './controller/student-submission-insights.controller';
import { StudentSubmissionInsightsService } from './services/student-submission-insights.service';

@Module({
	imports: [
		RspdGithubSubmissionModule,
		RspdChallengeManagementModule,
		RspdSubmissionManagementModule,
		RspdUserModule,
	],
	controllers: [StudentSubmissionInsightsController],
	providers: [StudentSubmissionInsightsService],
	exports: [],
})
export class RspdSubmissionInsightsModule {}
