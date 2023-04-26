import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from '@rspd/student-submissions/backend/common-models';
import { RspdUserModule } from '@rspd/user/backend/user-management';

import { SubmissionController } from './controller/submission.controller';
import { SubmissionService } from './services/submission.service';

@Module({
	imports: [RspdUserModule, TypeOrmModule.forFeature([Submission])],
	controllers: [SubmissionController],
	providers: [SubmissionService],
	exports: [RspdSubmissionManagementModule],
})
export class RspdSubmissionManagementModule {}
