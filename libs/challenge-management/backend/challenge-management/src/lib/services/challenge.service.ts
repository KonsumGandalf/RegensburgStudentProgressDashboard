import { InjectRepository } from '@nestjs/typeorm';
import { Challenge } from '@rspd/challenge-management/backend/common-models';
import {
	ActionExceptionType,
	ActionNotPerformedException,
	ActionObjectType,
	GenericRepositoryService,
	IDeleteResponse,
} from '@rspd/shared/backend/utils';
import { Repository } from 'typeorm';

import { AssignmentDto } from '../models/dto/assignment.dto';
import { CreateChallengeDto } from '../models/dto/create-challenge.dto';
import { AssignmentService } from './assignment.service';

/**
 * A service class for handling CRUD operations for Challenge entities.
 */
export class ChallengeService extends GenericRepositoryService<Challenge> {
	constructor(
		@InjectRepository(Challenge)
		private readonly _challengeRepo: Repository<Challenge>,
		private readonly _assignmentService: AssignmentService,
	) {
		super(_challengeRepo);
	}

	/**
	 * Creates a new Challenge entity as well as the associated assignments with the given data.
	 *
	 * @param {CreateChallengeDto} challengeDto - The DTO representing the Challenge to create.
	 * @returns {Promise<Challenge>} - The created Challenge entity with its embedded assignments.
	 */
	async createChallengeAndAssignments(challengeDto: CreateChallengeDto): Promise<Challenge> {
		const challenge = await super.create({
			name: challengeDto.name,
			targetedCompletionDate: challengeDto.targetedCompletionDate,
		});

		await Promise.all(
			challengeDto.assignments.map(async (assignment: AssignmentDto) => {
				return this._assignmentService.createAssignment(challenge, assignment);
			}),
		);

		return await this.getChallenge(challenge.id);
	}

	/**
	 * Retrieves a challenge by its ID.
	 *
	 * @param {string} id - The ID of the challenge to retrieve.
	 * @returns {Promise<Challenge>} A Promise that resolves with the retrieved challenge.
	 * @throws {NoContentException} Thrown if no challenge object with the given ID was found.
	 */
	async getChallenge(id) {
		return await super.findOneById(id);
	}

	/**
	 * Deletes a challenge and its associated assignments by its ID.
	 *
	 * @param {string} id - The ID of the challenge to delete.
	 * @returns {Promise<IDeleteResponse<Challenge>>} A Promise that resolves with an object containing the number of affected rows and the deleted challenge object.
	 * @throws {ActionNotPerformedException} Thrown if the deletion action was not performed.
	 */
	async deleteChallengeAndAssignment(id): Promise<IDeleteResponse<Challenge>> {
		const deleteResult = await super.delete(id);
		const assignmentIds = await this._assignmentService.getAssignmentByChallengeId(id);
		let affectedRows = await Promise.all(
			assignmentIds.map(async (assignment) => {
				return (await this._assignmentService.deleteAssignment(assignment.id)).affectedRows;
			}),
		).then((res) => res.reduce((acc, val) => acc + val));
		affectedRows += await this._challengeRepo.delete(id).then((res) => res.affected);
		return {
			affectedRows: deleteResult.affectedRows + affectedRows,
			deletedElements: deleteResult.deletedElements,
		};
	}

	/**
	 * Updates a challenge by its ID.
	 *
	 * @param {string} id - The ID of the challenge to update.
	 * @param {ChallengeDto} challengeDto - An object containing the updated challenge data.
	 * @returns {Promise<Challenge>} A Promise that resolves with the updated challenge object.
	 * @throws {ActionNotPerformedException} Thrown if the update action was not performed.
	 */
	async updateChallenge(id, challengeDto) {
		let updateElement;
		try {
			updateElement = await this.getChallenge(id);
		} catch (err) {
			throw new ActionNotPerformedException(
				ActionObjectType.CHALLENGE,
				+id,
				ActionExceptionType.UPDATE,
			);
		}

		return this._challengeRepo.save({
			...updateElement,
			...challengeDto,
		});
	}

	/**
	 * Retrieves a challenge by its ID with all corresponding entity connections.
	 *
	 * @param {string} id - The ID of the challenge.
	 * @returns {Promise<Challenge>} A Promise that resolves to the retrieved challenge.
	 */
	async getChallengeEagerly(id: string): Promise<Challenge> {
		return await this.findOptions({
			where: {
				id,
			},
			relations: ['assignments', 'tutor', 'submissions'],
		});
	}

	/**
	 * Retrieves a challenge by the ID of one of its assignments.
	 *
	 * @param {string} assignmentId - The ID of the assignment.
	 * @returns {Promise<Challenge>} A Promise that resolves to the retrieved challenge.
	 */
	async getChallengeByAssignmentId(assignmentId: string): Promise<Challenge> {
		return await this._challengeRepo
			.createQueryBuilder('challenge')
			.leftJoinAndSelect('challenge.assignments', 'assignment')
			.where('assignment.id = :id', { id: assignmentId })
			.getOne();
	}
}
