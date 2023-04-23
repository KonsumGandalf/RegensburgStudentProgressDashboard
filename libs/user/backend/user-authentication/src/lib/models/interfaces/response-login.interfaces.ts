/**
 * Interface for the response for authentication at the API.
 *
 * @interface
 * @property {string} access_token - The access token generated after successful login.
 */
export interface IResponseAuthentication {
    access_token: string;
}
