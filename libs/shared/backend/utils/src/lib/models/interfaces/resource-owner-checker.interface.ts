/**
 * Interface for checking if a user is the owner of a resource
 */
export interface IResourceOwnerChecker {
	/**
	 * Checks if the user with the given `username` owns the resource with the given `resourceId`.
	 * @param resourceId - The ID of the resource to check ownership for.
	 * @param username - The username of the user to check ownership for.
	 * @returns A boolean indicating whether the user is the owner of the resource.
	 */
	checkOwnership(resourceId: string, username: string): Promise<boolean>;
}
