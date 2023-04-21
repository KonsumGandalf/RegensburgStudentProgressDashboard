import { InjectRepository } from '@nestjs/typeorm';
import {
    ActionExceptionType,
    ActionNotPerformedException,
    ActionObjectType,
    NoContentException,
} from '@rspd/shared/backend/utils';
import { Repository } from 'typeorm';

import { AssignmentDto } from '../models/dto/assignment.dto';
import { CreateChallengeDto } from '../models/dto/create-challenge.dto';
import { Challenge } from '../models/entities/challenge.entity';
import { AssignmentService } from './assignment.service';

/**
 * A service class for handling CRUD operations for Challenge entities.
 *
 * @class
 * @constructor
 * @param {Repository<Challenge>} _challengeRepo - A repository for managing Challenge entities.
 * @param {Repository<Assignment>} _assignmentRepo - A repository for managing Assignment entities.
 */
export class ChallengeService {
    constructor(
        @InjectRepository(Challenge)
        private readonly _challengeRepo: Repository<Challenge>,
        private readonly _assignmentService: AssignmentService
    ) {}

    /**
     * Creates a new Challenge entity as well as the associated assignments with the given data.
     *
     * @async
     * @function
     * @param {CreateChallengeDto} challengeDto - The DTO representing the Challenge to create.
     * @returns {Promise<Challenge>} - The created Challenge entity with its embedded assignments.
     */
    async createChallengeAndAssignments(
        challengeDto: CreateChallengeDto
    ): Promise<Challenge> {
        let challenge = this._challengeRepo.create({
            name: challengeDto.name,
            targetedCompletionDate: challengeDto.targetedCompletionDate,
        } as unknown as Challenge);
        challenge = await this._challengeRepo.save(challenge);

        await Promise.all(
            challengeDto.assignments.map(async (assignment: AssignmentDto) => {
                return this._assignmentService.createAssignment(
                    challenge.id,
                    assignment
                );
            })
        );

        return await this.getChallenge(challenge.id);
    }

    /**
     * Retrieves a challenge by its ID.
     * @param {string} id - The ID of the challenge to retrieve.
     * @param {boolean} [withAssignments=true] - Whether to include the assignments associated with the challenge.
     * @returns {Promise<Challenge>} A Promise that resolves with the retrieved challenge.
     * @throws {NoContentException} Thrown if no challenge object with the given ID was found.
     */
    async getChallenge(id, withAssignments = true) {
        const response = withAssignments
            ? await this._challengeRepo.findOne({
                  where: { id },
                  relations: ['assignments'],
              })
            : await this._challengeRepo.findOne({
                  where: { id },
              });

        if (response == undefined) {
            throw new NoContentException(
                `No challenge object with id:${id} was found`
            );
        }

        return response;
    }

    /**
     * Deletes a challenge and its associated assignments by its ID.
     * @param {string} id - The ID of the challenge to delete.
     * @returns {Promise<IDeleteResponse<Challenge>>} A Promise that resolves with an object containing the number of affected rows and the deleted challenge object.
     * @throws {ActionNotPerformedException} Thrown if the deletion action was not performed.
     */
    async deleteChallengeAndAssignment(id) {
        let deletedElements;
        try {
            deletedElements = await this.getChallenge(id);
        } catch (err) {
            throw new ActionNotPerformedException(
                ActionObjectType.CHALLENGE,
                +id,
                ActionExceptionType.DELETE
            );
        }

        const assignmentIds =
            await this._assignmentService.getAssignmentByChallengeId(id);
        let affectedRows = await Promise.all(
            assignmentIds.map(async (assignment) => {
                return (
                    await this._assignmentService.deleteAssignment(
                        assignment.id
                    )
                ).affectedRows;
            })
        ).then((res) => res.reduce((acc, val) => acc + val));
        affectedRows += await this._challengeRepo
            .delete(id)
            .then((res) => res.affected);

        return {
            affectedRows,
            deletedElements,
        };
    }

    /**
     * Updates a challenge by its ID.
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
                ActionExceptionType.UPDATE
            );
        }

        return this._challengeRepo.save({
            ...updateElement,
            ...challengeDto,
        });
    }
}
