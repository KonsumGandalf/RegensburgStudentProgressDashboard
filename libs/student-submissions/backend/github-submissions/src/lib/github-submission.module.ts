import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RspdChallengeManagementModule } from '@rspd/challenge-management/backend/challenge-management';
import { RspdUserModule } from '@rspd/user/backend/user-management';

import { GithubSubmissionController } from './controller/github-submission.controller';
import { GithubSubmission } from './models/entities/github-submission.entity';
import { GithubTest } from './models/entities/github-test.entity';
import { GithubSubmissionService } from './services/github-submission.service';
import { GithubTestService } from './services/github-test.service';

@Module({
	imports: [
		RspdUserModule,
		RspdChallengeManagementModule,
		TypeOrmModule.forFeature([GithubSubmission, GithubTest]),
	],
	controllers: [GithubSubmissionController],
	providers: [GithubSubmissionService, GithubTestService],
	exports: [RspdGithubSubmissionModule],
})
export class RspdGithubSubmissionModule {}

/**
 }interface IRegisterModuleOption {
    imports?: ModuleMetadata['imports'];
    assignments: Partial<Record<AssignmentType, Type<AssignmentProvider>>>;
}
 *
 *     public static register(options: IRegisterModuleOption): DynamicModule {
 *         const moduleProviders = Object.entries(options.assignments).map(
 *             ([type, assignmentClass]: [
 *                 AssignmentType,
 *                 Type<AssignmentProvider>
 *             ]) => ({
 *                 provide: getAssignmentProviderToken(type),
 *                 useClass: assignmentClass,
 *             })
 *         );
 *
 *         return {
 *             module: RspdGradeModule,
 *             imports: options.imports,
 *             providers: [...moduleProviders],
 *         };
 *     }
 */
