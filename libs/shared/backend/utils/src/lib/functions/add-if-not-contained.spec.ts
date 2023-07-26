import { addIfNotContained } from './add-if-not-contained';

describe('addIfNotContained', () => {
	it('should add the item to the list if it is not already contained', () => {
		const list = [1, 2, 3];
		const newItem = 4;
		const result = addIfNotContained(list, newItem);
		expect(result).toEqual([1, 2, 3, 4]);
	});

	it('should not add the item to the list if it is already contained', () => {
		const list = [1, 2, 3];
		const newItem = 2;
		const result = addIfNotContained(list, newItem);
		expect(result).toEqual([1, 2, 3]);
	});

	it('should handle empty lists', () => {
		const list = [];
		const newItem = 1;
		const result = addIfNotContained(list, newItem);
		expect(result).toEqual([1]);
	});
});
