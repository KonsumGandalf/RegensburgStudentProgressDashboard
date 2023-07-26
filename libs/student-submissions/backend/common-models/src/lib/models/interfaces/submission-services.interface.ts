/**
 * Interface for submission services.
 *
 * @template SubmissionType - The type of the submission.
 */
export interface ISubmissionServices<SubmissionType> {
	/**
	 * Retrieves the solved elements of a user.
	 *
	 * @param {string} username - The username of the user.
	 * @returns {Promise<SubmissionType[]>} A Promise that resolves to an array of solved submissions.
	 */
	getUserSolvedElements(username: string): Promise<SubmissionType[]>;
}
