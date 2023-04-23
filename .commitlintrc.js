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
