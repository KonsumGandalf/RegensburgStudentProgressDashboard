import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student, Tutor, User } from '@rspd/user/backend/common-models';

import { UserController } from './controller/user.controller';
import { StudentService } from './services/student.service';
import { TutorService } from './services/tutor.service';
import { UserService } from './services/user.service';

@Module({
	imports: [TypeOrmModule.forFeature([Student, Tutor, User])],
	controllers: [UserController],
	providers: [UserService, StudentService, TutorService],
	exports: [RspdUserModule, UserService, StudentService, TutorService],
})
export class RspdUserModule {}
