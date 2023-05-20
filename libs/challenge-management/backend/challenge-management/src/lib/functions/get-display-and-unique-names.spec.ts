import { getDisplayAndUniqueName } from './get-display-and-unique-names';

describe('getDisplayAndUniqueName', () => {
	it('should transform the name property correctly', async () => {
		const testName = ' Test 923 ';

		const result = getDisplayAndUniqueName(testName);

		expect(result).toEqual({
			name: 'test-923',
			displayName: 'Test 923',
		});
	});
});
