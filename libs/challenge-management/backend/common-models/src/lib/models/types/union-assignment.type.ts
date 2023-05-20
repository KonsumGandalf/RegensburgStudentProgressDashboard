import {
	Assignment,
	GithubAssignment,
	MoodleAssignment,
} from '@rspd/challenge-management/backend/common-models';

/**
 * Represents a union of different assignment types.
 */
export type UnionAssignment = Assignment | GithubAssignment | MoodleAssignment;
