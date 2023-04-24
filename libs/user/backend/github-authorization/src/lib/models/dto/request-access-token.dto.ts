import { IsString } from 'class-validator';

import { AuthenticationCodeDto } from './authentication-code.dto';

/**
 * Data transfer object for the request to save an access token, based on the authentication code received from the frontend and the client credentials.
 *
 */
export class RequestAccessTokenDto extends AuthenticationCodeDto {
    /**
     * The client ID used to authenticate with the API.
     *
     * @type {string}
     */
    @IsString()
    client_id: string;

    /**
     * The client secret used to authenticate with the API.
     *
     * @type {string}
     */
    @IsString()
    clientSecret: string;
}
