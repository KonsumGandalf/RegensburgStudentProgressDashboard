const {
	utils: { getProjects },
} = require('@commitlint/config-nx-scopes');

module.exports = {
	rules: {
		'scope-enum': async (ctx) => [
			2,
			'always',
			[
				'uml',
				'base-application',
				'devops',
				'challenge-management-backend-challenge-management',
				'challenge-management-backend-common-models',
				'challenge-management-backend-semester-management',
				'challenge-management-backend',
				'student-submissions-backend-common-models',
				'moodle-management-backend-moodle-management',
				'moodle-management-backend-request-handler',
				'student-submissions-backend-submission-management',
				'student-submissions-backend-github-submissions',
				'student-submissions-backend-submission-insights',
				'student-submissions-backend',
				'shared-backend-test-util',
				'shared-backend-utils',
				'user-backend-github-authorization',
				'user-backend-common-models',
				'user-backend-user-authentication',
				'user-backend-user-mail-management',
				'user-backend-user-management',
				'user-backend',
			],
		],
	},
};
