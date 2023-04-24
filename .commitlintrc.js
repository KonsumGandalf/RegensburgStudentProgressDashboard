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
                'student-submissions-backend-common-models',
                'student-submissions-backend-submission-management',
                'student-submissions-backend-github-submissions',
                'challenge-management-backend-challenge-management',
                'challenge-management-backend-common-models',
                'shared-backend-test-util',
                'shared-backend-utils',
                'user-backend-common-models',
                'user-backend-user-authentication',
                'user-backend-user-mail-management',
                'user-backend-user-management',
            ],
        ],
    },
};
