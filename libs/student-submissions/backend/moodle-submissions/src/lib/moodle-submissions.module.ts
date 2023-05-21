import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RspdChallengeManagementModule } from '@rspd/challenge-management/backend/challenge-management';
import { RspdMoodleManagementModule } from '@rspd/moodle-management/backend/moodle-management';
import { MoodleSubmission } from '@rspd/student-submissions/backend/common-models';
import { RspdSubmissionManagementModule } from '@rspd/student-submissions/backend/submission-management';
import { RspdUserModule } from '@rspd/user/backend/user-management';

import { MoodleSubmissionController } from './controller/moodle-submission.controller';
import { MoodleSubmissionService } from './services/moodle-submission.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([MoodleSubmission]),
		RspdChallengeManagementModule,
		RspdSubmissionManagementModule,
		RspdUserModule,
		RspdMoodleManagementModule,
	],
	controllers: [MoodleSubmissionController],
	providers: [MoodleSubmissionService],
	exports: [MoodleSubmissionService],
})
export class RspdMoodleSubmissionModule {}
