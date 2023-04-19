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
                'grade-backend-github',
                'shared-backend-test-util',
            ],
        ],
    },
};
