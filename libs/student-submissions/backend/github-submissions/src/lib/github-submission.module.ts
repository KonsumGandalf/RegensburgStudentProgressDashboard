import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RspdChallengeManagementModule } from '@rspd/challenge-management/backend/challenge-management';
import { GithubTest } from '@rspd/student-submissions/backend/common-models';
import { GithubSubmission } from '@rspd/student-submissions/backend/common-models';
import { RspdSubmissionManagementModule } from '@rspd/student-submissions/backend/submission-management';
import { RspdUserModule } from '@rspd/user/backend/user-management';

import { GithubSubmissionController } from './controller/github-submission.controller';
import { GithubSubmissionService } from './services/github-submission.service';
import { GithubTestService } from './services/github-test.service';

@Module({
	imports: [
		RspdUserModule,
		RspdChallengeManagementModule,
		TypeOrmModule.forFeature([GithubSubmission, GithubTest]),
		RspdSubmissionManagementModule,
	],
	controllers: [GithubSubmissionController],
	providers: [GithubSubmissionService, GithubTestService],
	exports: [RspdGithubSubmissionModule, GithubTestService, GithubSubmissionService],
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
