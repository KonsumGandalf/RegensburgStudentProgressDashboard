import { RouteTree } from '@nestjs/core';
import { RspdChallengeManagementModule } from '@rspd/challenge-management/backend/challenge-management';
import { RspdGithubSubmissionModule } from '@rspd/student-submissions/backend/github-submissions';
import { RspdMoodleSubmissionModule } from '@rspd/student-submissions/backend/moodle-submissions';
import { RspdSubmissionInsightsModule } from '@rspd/student-submissions/backend/submission-insights';
import { RspdSubmissionManagementModule } from '@rspd/student-submissions/backend/submission-management';
import { RspdAuthModule } from '@rspd/user/backend/user-authentication';
import { RspdUserMailManagementModule } from '@rspd/user/backend/user-mail-management';
import { RspdUserModule } from '@rspd/user/backend/user-management';

export const backendRoutes: RouteTree[] = [
	{
		path: '/mail',
		module: RspdUserMailManagementModule,
	},
	{
		path: '/challenge',
		module: RspdChallengeManagementModule,
	},
	{
		path: '/user',
		module: RspdUserModule,
	},
	{
		path: '/auth',
		module: RspdAuthModule,
	},
	{
		path: '/submission',
		module: RspdSubmissionManagementModule,
		children: [
			{
				path: 'insight',
				module: RspdSubmissionInsightsModule,
			},
		],
	},
	{
		path: '/github',
		module: RspdGithubSubmissionModule,
	},
	{
		path: 'submission-moodle',
		module: RspdMoodleSubmissionModule,
	},
];
