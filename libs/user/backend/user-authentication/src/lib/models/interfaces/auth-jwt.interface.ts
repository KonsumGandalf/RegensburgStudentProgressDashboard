/**
 * Represents the properties of a JSON Web Token (JWT) used for authentication.
 *
 * @interface
 */
export interface IAuthJwt {
    user: {
        /**
         * The username associated with the JWT.
         */
        username: string;

        /**
         * The ID associated with the JWT.
         */
        id: number;

        /**
         * The time at which the JWT was issued, in Unix time (seconds since 1970-01-01 00:00:00 UTC).
         */
        iat: number;

        /**
         * The time at which the JWT will expire, in Unix time (seconds since 1970-01-01 00:00:00 UTC).
         */
        exp: number;
    };
}
