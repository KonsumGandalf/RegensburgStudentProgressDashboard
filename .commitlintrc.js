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
                'grade-backend-github',
                'shared-backend-test-util',
                'shared-backend-utils',
                'user-backend-user-management',
                'user-backend-user-authentication',
            ],
        ],
    },
};
