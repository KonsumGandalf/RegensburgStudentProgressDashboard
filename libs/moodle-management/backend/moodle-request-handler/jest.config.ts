/* eslint-disable */
export default {
	displayName: 'moodle-management-backend-moodle-request-handler',
	preset: '../../../../jest.preset.js',
	testEnvironment: 'node',
	transform: {
		'^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
	},
	moduleFileExtensions: ['ts', 'js', 'html'],
	coverageDirectory: '../../../../coverage/libs/moodle-management/backend/moodle-request-handler',
};
