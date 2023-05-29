/**
 * Interface for the response for authentication at the API.
 */
export interface IResponseAuthentication {
	access_token: string;
	tokenExpirationDate: Date;
}
