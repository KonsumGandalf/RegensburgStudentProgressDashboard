import { IMoodleAssignmentGrade } from './moodle-assignment-grade.interface';

/**
 * Represents the Moodle information returned in Assignment Grade Search - 'mod_assign_get_grades'
 */
export interface IAssignmentGradeSearch {
	assignments: IMoodleAssignmentGrade[];
}
