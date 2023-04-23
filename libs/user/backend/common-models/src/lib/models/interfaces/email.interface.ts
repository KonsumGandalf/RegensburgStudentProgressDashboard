export interface IEmail {
    /**
     * The primary email address of the user.
     *
     * @type {string}
     */
    email: string;

    /**
     * The indicator if an accounts email has been confirmed
     *
     * @type{boolean}
     */
    isEmailValidated: boolean;
}
