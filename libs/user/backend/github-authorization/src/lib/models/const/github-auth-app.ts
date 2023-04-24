import { createOAuthAppAuth } from '@octokit/auth-oauth-app';

/**
 * Creates an instance of OAuthAppAuth with the provided client ID and client secret.
 *
 * @param {string} clientId The client ID for the OAuth app.
 * @param {string} clientSecret The client secret for the OAuth app.
 * @returns {OAuthAppAuth} An instance of OAuthAppAuth with the provided client ID and client secret.
 */
export const githubAuthApp = (clientId: string, clientSecret: string) =>
    createOAuthAppAuth({
        clientType: 'oauth-app',
        clientId,
        clientSecret,
    });
