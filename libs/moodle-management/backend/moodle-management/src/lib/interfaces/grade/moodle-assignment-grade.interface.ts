import { IMoodleGrade } from './moodle-grade.interface';

/**
 * Represents the grades for a Moodle assignment.
 */
export interface IMoodleAssignmentGrade {
	grades: IMoodleGrade[];
}
