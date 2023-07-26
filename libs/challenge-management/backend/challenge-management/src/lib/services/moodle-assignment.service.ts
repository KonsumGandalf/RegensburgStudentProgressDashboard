import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Challenge, MoodleAssignment } from '@rspd/challenge-management/backend/common-models';
import { GenericRepositoryService } from '@rspd/shared/backend/utils';
import { Repository } from 'typeorm';

import { getDisplayAndUniqueName } from '../functions/get-display-and-unique-names';
import { MoodleAssignmentDto } from '../models/dto/moodle-assignment.dto';

@Injectable()
export class MoodleAssignmentService extends GenericRepositoryService<MoodleAssignment> {
	constructor(
		@InjectRepository(MoodleAssignment)
		private readonly _assignmentRepo: Repository<MoodleAssignment>,
	) {
		super(_assignmentRepo);
	}

	/**
	 * Creates a new assignment for a given challenge.
	 *
	 * @param challenge
	 * @param moodleCourseId
	 * @param {AssignmentDto} assignment - The assignment object to create.
	 * @returns {Promise<Assignment>} The created assignment object.
	 */
	async createAssignment(
		challenge: Challenge,
		moodleCourseId: number,
		assignment: MoodleAssignmentDto,
	): Promise<MoodleAssignment> {
		return await this.create({
			...assignment,
			challenge,
			...getDisplayAndUniqueName(assignment.displayName),
			moodleCourseId,
		} as MoodleAssignment);
	}

	/**
	 * Update an Assignment by ID.
	 *
	 * @param id - The ID of the Assignment.
	 * @param assignment - The Assignment data to update.
	 * @returns A Promise that resolves to the updated Assignment.
	 * @throws {ActionNotPerformedException} - If the assignment with the given ID was not found.
	 */
	async updateAssignment(id: string, assignment: MoodleAssignmentDto): Promise<MoodleAssignment> {
		return await this.update(id, {
			...assignment,
			...getDisplayAndUniqueName(assignment.displayName),
		} as MoodleAssignment);
	}
}
