export function getDisplayAndUniqueName(name: string) {
	return {
		name: name.trim().replace(' ', '-').toLowerCase(),
		displayName: name.trim(),
	};
}
