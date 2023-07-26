/* eslint-disable */
export default {
	displayName: 'student-submissions-backend-submission-management',
	preset: '../../../../jest.preset.js',
	testEnvironment: 'node',
	transform: {
		'^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
	},
	moduleFileExtensions: ['ts', 'js', 'html'],
	coverageDirectory:
		'../../../../coverage/libs/student-submissions/backend/submission-management',
};
