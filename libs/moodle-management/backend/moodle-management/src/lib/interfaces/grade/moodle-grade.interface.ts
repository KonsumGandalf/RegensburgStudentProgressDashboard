/**
 * Represents a grade for a user in Moodle.
 */
export interface IMoodleGrade {
	/**
	 * The grade value. "1.000" means failed, "2.000" means passed
	 */
	grade: string;
	/**
	 * The moodle user ID
	 */
	userid: number;
}
