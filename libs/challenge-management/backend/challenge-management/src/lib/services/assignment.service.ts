import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
	Assignment,
	Challenge,
	UnionAssignment,
} from '@rspd/challenge-management/backend/common-models';
import {
	AssignmentType,
	GenericRepositoryService,
	IDeleteResponse,
} from '@rspd/shared/backend/utils';
import { Repository } from 'typeorm';

import { CreateChallengeDto } from '../models/dto/create-challenge.dto';
import { GithubAssignmentDto } from '../models/dto/github-assignment.dto';
import { MoodleAssignmentDto } from '../models/dto/moodle-assignment.dto';
import { GithubAssignmentService } from './github-assignment.service';
import { MoodleAssignmentService } from './moodle-assignment.service';

/**
 * Service for handling Assignment-related operations.
 */
@Injectable()
export class AssignmentService extends GenericRepositoryService<Assignment> {
	constructor(
		private readonly _moodleAssignmentService: MoodleAssignmentService,
		private readonly _githubAssignmentService: GithubAssignmentService,
		@InjectRepository(Assignment)
		private readonly _assignmentRepo: Repository<Assignment>,
	) {
		super(_assignmentRepo);
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

	/**
	 * Creates a new assignment for a given challenge.
	 *
	 * @param challenge
	 * @param {AssignmentDto} assignment - The assignment object to create.
	 * @param challengeDto
	 * @returns {Promise<Assignment>} The created assignment object.
	 */
	async createAssignment(
		challenge: Challenge,
		assignment: MoodleAssignmentDto | GithubAssignmentDto,
		challengeDto: CreateChallengeDto,
	): Promise<UnionAssignment> {
		if (assignment.type == AssignmentType.MOODLE) {
			return this._moodleAssignmentService.createAssignment(
				challenge,
				challengeDto.moodleCourseId,
				assignment as MoodleAssignmentDto,
			);
		} else if (assignment.type == AssignmentType.GITHUB) {
			return this._githubAssignmentService.createAssignment(
				challenge,
				assignment as GithubAssignmentDto,
			);
		}
	}

	async updateAssignment(
		id,
		assignment: MoodleAssignmentDto | GithubAssignmentDto,
	): Promise<UnionAssignment> {
		if (assignment.type == AssignmentType.MOODLE) {
			return this._moodleAssignmentService.updateAssignment(
				id,
				assignment as MoodleAssignmentDto,
			);
		} else if (assignment.type == AssignmentType.GITHUB) {
			return this._githubAssignmentService.updateAssignment(
				id,
				assignment as GithubAssignmentDto,
			);
		}
	}

	async findAllAssignments(): Promise<UnionAssignment[]> {
		return [
			...(await this._githubAssignmentService.findAll()),
			...(await this._moodleAssignmentService.findAll()),
		];
	}
}
