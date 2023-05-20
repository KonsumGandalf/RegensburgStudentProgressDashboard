import { IMoodleAssignment } from './moodle-assignment.interface';

/**
 * Represents the single Moodle course
 */
export interface IMoodleCourse {
	id: string;
	assignments: IMoodleAssignment[];
}
