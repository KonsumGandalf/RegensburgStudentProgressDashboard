import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
	Assignment,
	Challenge,
	GithubAssignment,
	MoodleAssignment,
} from '@rspd/challenge-management/backend/common-models';
import { RspdSemesterManagementModule } from '@rspd/challenge-management/backend/semester-management';
import { RspdMoodleManagementModule } from '@rspd/moodle-management/backend/moodle-management';
import { RspdUserModule } from '@rspd/user/backend/user-management';

import { AssignmentController } from './controller/assignment.controller';
import { ChallengeController } from './controller/challenge.controller';
import { AssignmentService } from './services/assignment.service';
import { ChallengeService } from './services/challenge.service';
import { GithubAssignmentService } from './services/github-assignment.service';
import { MoodleAssignmentService } from './services/moodle-assignment.service';

@Module({
	imports: [
		RspdUserModule,
		RspdMoodleManagementModule,
		RspdSemesterManagementModule,
		TypeOrmModule.forFeature([Challenge, Assignment, GithubAssignment, MoodleAssignment]),
	],
	controllers: [ChallengeController, AssignmentController],
	providers: [
		ChallengeService,
		AssignmentService,
		MoodleAssignmentService,
		GithubAssignmentService,
	],
	exports: [
		RspdChallengeManagementModule,
		AssignmentService,
		ChallengeService,
		GithubAssignmentService,
		MoodleAssignmentService,
	],
})
export class RspdChallengeManagementModule {}
