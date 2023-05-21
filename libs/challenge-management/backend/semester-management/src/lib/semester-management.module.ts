import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semester } from '@rspd/challenge-management/backend/common-models';

import { SemesterController } from './controller/semester.controller';
import { SemesterService } from './services/semester.service';

@Module({
	imports: [TypeOrmModule.forFeature([Semester])],
	controllers: [SemesterController],
	providers: [SemesterService],
	exports: [RspdSemesterManagementModule, SemesterService],
})
export class RspdSemesterManagementModule {}
