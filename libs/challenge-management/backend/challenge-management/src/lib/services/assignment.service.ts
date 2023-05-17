import { InjectRepository } from '@nestjs/typeorm';
import { Assignment, Challenge } from '@rspd/challenge-management/backend/common-models';
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

	getDisplayAndUniqueName(name: string) {
		return {
			name: name.trim().replace(' ', '-').toLowerCase(),
			displayName: name.trim(),
		};
	}

	/**
	 * Creates a new assignment for a given challenge.
	 *
	 * @param challenge
	 * @param {AssignmentDto} assignment - The assignment object to create.
	 * @returns {Promise<Assignment>} The created assignment object.
	 */
	async createAssignment(challenge: Challenge, assignment: AssignmentDto): Promise<Assignment> {
		return await super.create({
			...assignment,
			challenge,
			...this.getDisplayAndUniqueName(assignment.displayName),
		} as Assignment);
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
	 * Get an Assignment by unique name.
	 *
	 * @param name - The unique name of the Assignment.
	 * @returns A Promise that resolves to the Assignment.
	 * @throws {NoContentException} if no assignment was found for the corresponding id
	 */
	async getAssignmentByName(name: string): Promise<Assignment> {
		return super.findOptions({
			where: {
				name: name,
			},
		});
	}

	/**
	 * Get an Assignment by a substring of the repositoryUrl.
	 *
	 * @param repositoryUrl - The URL of the Assignment.
	 * @returns A Promise that resolves to the Assignment.
	 * @throws {NoContentException} if no assignment was found for the corresponding id
	 */
	async getAssignmentByRepositoryUrl(repositoryUrl: string): Promise<Assignment> {
		return this.findOptions({
			where: {
				repositoryUrl,
			},
			relations: ['challenge'],
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
		return await super.update(id, {
			...assignment,
			...this.getDisplayAndUniqueName(assignment.displayName),
		} as Assignment);
	}

	/**
	 * Returns the challenge which is associated with the Assigment
	 *
	 * @param id - The ID of the Assignment.
	 * @returns A Promise that resolves to found Challenge.
	 */
	async getChallengeByAssignmentId(id: string): Promise<Challenge> {
		return await this.findOptions({
			where: {
				id,
			},
			relations: ['challenge'],
		}).then((assignment) => assignment.challenge);
	}
}
