import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Challenge } from '@rspd/challenge-management/backend/common-models';
import { GithubAssignment } from '@rspd/challenge-management/backend/common-models';
import { SemesterService } from '@rspd/challenge-management/backend/semester-management';
import { GenericRepositoryService } from '@rspd/shared/backend/utils';
import { Repository } from 'typeorm';

import { getDisplayAndUniqueName } from '../functions/get-display-and-unique-names';
import { GithubAssignmentDto } from '../models/dto/github-assignment.dto';

@Injectable()
export class GithubAssignmentService extends GenericRepositoryService<GithubAssignment> {
	constructor(
		@InjectRepository(GithubAssignment)
		private readonly _assignmentRepo: Repository<GithubAssignment>,
		private readonly _semesterService: SemesterService,
	) {
		super(_assignmentRepo);
	}

	/**
	 * Creates a new assignment for a given challenge.
	 *
	 * @param challenge
	 * @param {AssignmentDto} assignment - The assignment object to create.
	 * @returns {Promise<Assignment>} The created assignment object.
	 */
	async createAssignment(
		challenge: Challenge,
		assignment: GithubAssignmentDto,
	): Promise<GithubAssignment> {
		return await this.create({
			...assignment,
			challenge,
			...getDisplayAndUniqueName(assignment.displayName),
		} as GithubAssignment);
	}

	/**
	 * Get an Assignment by a substring of the repositoryUrl.
	 *
	 * @param repositoryUrl - The URL of the Assignment.
	 * @returns A Promise that resolves to the Assignment.
	 * @throws {NoContentException} if no assignment was found for the corresponding id
	 */
	async getAssignmentByRepositoryUrl(repositoryUrl: string): Promise<GithubAssignment> {
		const currentSemester = await this._semesterService.getCurrentSemester();
		return await this.findOptions({
			where: {
				repositoryUrl,
				challenge: {
					semester: {
						id: currentSemester.id,
					},
				},
			} as GithubAssignment,
			relations: ['challenge', 'challenge.semester'],
		});
	}

	/**
	 * Update an Assignment by ID.
	 *
	 * @param id - The ID of the Assignment.
	 * @param assignment - The Assignment data to update.
	 * @returns A Promise that resolves to the updated Assignment.
	 * @throws {ActionNotPerformedException} - If the assignment with the given ID was not found.
	 */
	async updateAssignment(id: string, assignment: GithubAssignmentDto): Promise<GithubAssignment> {
		return await this.update(id, {
			...assignment,
			...getDisplayAndUniqueName(assignment.displayName),
		} as GithubAssignment);
	}
}
