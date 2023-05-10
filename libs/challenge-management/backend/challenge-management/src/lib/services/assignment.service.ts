import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from '@rspd/challenge-management/backend/common-models';
import { GenericRepositoryService, IDeleteResponse } from '@rspd/shared/backend/utils';
import { Like, Repository } from 'typeorm';

import { AssignmentDto } from '../models/dto/assignment.dto';

/**
 * Service for handling Assignment-related operations.
 */
export class AssignmentService extends GenericRepositoryService<Assignment> {
	/**
	 * Constructor that injects the Assignment repository.
	 *     * @param {Repository<Assignment>} _assignmentRepo - The Assignment repository.
	 */
	constructor(
		@InjectRepository(Assignment)
		private readonly _assignmentRepo: Repository<Assignment>,
	) {
		super(_assignmentRepo);
	}

	/**
	 * Creates a new assignment for a given challenge.
	 *
	 * @param {string} challengeId - The id of the challenge for which the assignment is created.
	 * @param {AssignmentDto} assignment - The assignment object to create.
	 * @returns {Promise<Assignment>} The created assignment object.
	 */
	async createAssignment(challengeId: string, assignment: AssignmentDto) {
		return await super.create({
			...assignment,
			challengeId,
		});
	}

	/**
	 * Get an Assignment by ID.
	 *
	 * @param id - The ID of the Assignment.
	 * @returns A Promise that resolves to the Assignment.
	 * @throws {NoContentException} if no assignment was found for the corresponding id
	 */
	async getAssignmentById(id: string): Promise<Assignment> {
		return super.findOneById(id);
	}

	/**
	 * Get an Assignment by a substring of the repositoryUrl.
	 *
	 * @param repositoryUrl - The URL of the Assignment.
	 * @returns A Promise that resolves to the Assignment.
	 * @throws {NoContentException} if no assignment was found for the corresponding id
	 */
	async getAssignmentByRepositoryUrl(repositoryUrl: string): Promise<Assignment> {
		return super.findOptions({
			where: {
				repositoryUrl: Like(`${repositoryUrl}%`),
			},
		});
	}

	/**
	 * Finds all assignments for a given challenge ID.
	 * @param {string} challengeId - The ID of the challenge to search for.
	 * @returns {Promise<Assignment[]>} - A promise that resolves to an array of assignments for the challenge.
	 * @throws {NoContentException} - If no assignments were found for the challenge.
	 */
	async getAssignmentByChallengeId(challengeId: string): Promise<Assignment[]> {
		return await super.findOptionsMany({
			where: { challengeId },
		});
	}

	/**
	 * Deletes an assignment with the given ID from the database.
	 *
	 * @param {string} id - The ID of the assignment to delete.
	 * @returns {Promise<IDeleteResponse<Assignment>>} - A promise that resolves to an object containing the number of affected rows and the deleted assignment.
	 * @throws {ActionNotPerformedException} - If the assignment with the given ID was not found.
	 */
	async deleteAssignment(id: string): Promise<IDeleteResponse<Assignment>> {
		return await super.delete(id);
	}

	/**
	 * Update an Assignment by ID.
	 *
	 * @param id - The ID of the Assignment.
	 * @param assignment - The Assignment data to update.
	 * @returns A Promise that resolves to the updated Assignment.
	 * @throws {ActionNotPerformedException} - If the assignment with the given ID was not found.
	 */
	async updateAssignment(id: string, assignment: AssignmentDto): Promise<Assignment> {
		return await super.update(id, assignment);
	}
}
