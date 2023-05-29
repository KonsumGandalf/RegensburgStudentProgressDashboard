/**
 * Interface for checking availability.
 */
export interface ICheckAvailability {
	/**
	 * The email to check availability for.
	 */
	email?: string;

	/**
	 * The username to check availability for.
	 */
	username?: string;

	/**
	 * The confirmed email to check availability for.
	 */
	confirmedMail?: string;
}
