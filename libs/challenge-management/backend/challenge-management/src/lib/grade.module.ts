import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssignmentController } from './controller/assignment.controller';
import { ChallengeController } from './controller/challenge.controller';
import { Assignment } from './models/entities/assignment.entity';
import { Challenge } from './models/entities/challenge.entity';
import { AssignmentService } from './services/assignment.service';
import { ChallengeService } from './services/challenge.service';

@Module({
    imports: [TypeOrmModule.forFeature([Challenge, Assignment])],
    controllers: [ChallengeController, AssignmentController],
    providers: [ChallengeService, AssignmentService],
    exports: [],
})
export class RspdGradeModule {}
