/**
 * Adds an item to a list if it is not already contained.
 *
 * @template T The type of items in the list.
 * @param {T[]} list The list to add the item to.
 * @param {T} item The item to add to the list.
 * @returns {T[]}
 */
export function addIfNotContained<T>(list: T[], newItem: T): T[] {
	if (!list.includes(newItem)) {
		return [...list, newItem];
	}
	return list;
}
