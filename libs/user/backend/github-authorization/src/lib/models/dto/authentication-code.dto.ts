import { IsString } from 'class-validator';

/**
 * Data transfer object for the authentication code received from the frontend after the user accepts authentication.
 */
export class AuthenticationCodeDto {
    /**
     * The authentication code received from the frontend.
     *
     * @type {string}
     */
    @IsString()
    code: string;
}
