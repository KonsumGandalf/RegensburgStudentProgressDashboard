/**
 * Interface representing a GitHub user.
 */
export interface IGithubUser {
    /**
     * The username of the GitHub user.
     *
     * @type {string}
     */
    username: string;

    /**
     * The node ID of the GitHub user.
     *
     * @type {string}
     */
    nodeId: string;

    /**
     * The URL of the avatar image for the GitHub user.
     *
     * @type {string|undefined}
     */
    avatarUrl?: string;
}
