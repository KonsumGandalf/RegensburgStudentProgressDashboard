import { IMoodleCourse } from './moodle-course.interface';

/**
 * Represents the Moodle information returned in Course Search - 'mod_assign_get_assignments'
 */
export interface ICourseSearch {
	courses: IMoodleCourse[];
}
