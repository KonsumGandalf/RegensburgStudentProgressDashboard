import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment, Challenge } from '@rspd/challenge-management/backend/common-models';

import { AssignmentController } from './controller/assignment.controller';
import { ChallengeController } from './controller/challenge.controller';
import { AssignmentService } from './services/assignment.service';
import { ChallengeService } from './services/challenge.service';

@Module({
	imports: [TypeOrmModule.forFeature([Challenge, Assignment])],
	controllers: [ChallengeController, AssignmentController],
	providers: [ChallengeService, AssignmentService],
	exports: [RspdChallengeManagementModule, AssignmentService, ChallengeService],
})
export class RspdChallengeManagementModule {}
