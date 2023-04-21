import { InjectRepository } from '@nestjs/typeorm';
import {
    ActionNotPerformedException,
    ActionObjectType,
    IDeleteResponse,
    NoContentException,
} from '@rspd/shared/backend/utils';
import { ActionExceptionType } from '@rspd/shared/backend/utils';
import { Repository } from 'typeorm';

import { AssignmentDto } from '../models/dto/assignment.dto';
import { Assignment } from '../models/entities/assignment.entity';

/**
 * Service for handling Assignment-related operations.
 */
export class AssignmentService {
    /**
     * Constructor that injects the Assignment repository.
     * @param _assignmentRepo - The Assignment repository.
     */
    constructor(
        @InjectRepository(Assignment)
        private readonly _assignmentRepo: Repository<Assignment>
    ) {}

    async createAssignment(challengeId: string, assignment: AssignmentDto) {
        const assignmentEntity = await this._assignmentRepo.create({
            challengeId: challengeId,
            ...assignment,
        });
        return await this._assignmentRepo.save(assignmentEntity);
    }

    /**
     * Get an Assignment by ID.
     * @param id - The ID of the Assignment.
     * @returns A Promise that resolves to the Assignment.
     * @throws {NoContentException} if no assignment was found for the corresponding id
     */
    async getAssignmentById(id: string): Promise<Assignment> {
        const response = await this._assignmentRepo.findOne({
            where: { id },
        });

        if (response == undefined) {
            throw new NoContentException(
                `No assignment object with id:${id} was found`
            );
        }

        return response;
    }

    /**
     * Finds all assignments for a given challenge ID.
     * @param {string} challengeId - The ID of the challenge to search for.
     * @returns {Promise<Assignment[]>} - A promise that resolves to an array of assignments for the challenge.
     * @throws {NoContentException} - If no assignments were found for the challenge.
     */
    async getAssignmentByChallengeId(
        challengeId: string
    ): Promise<Assignment[]> {
        const response: Assignment[] = await this._assignmentRepo.find({
            where: { challengeId },
        });

        if (response === undefined || response.length === 0) {
            throw new NoContentException(
                `No assignment objects were found for challenge ID '${challengeId}'.`
            );
        }

        return response;
    }

    /**
     * Deletes an assignment with the given ID from the database.
     * @param {string} id - The ID of the assignment to delete.
     * @returns {Promise<IDeleteResponse<Assignment>>} - A promise that resolves to an object containing the number of affected rows and the deleted assignment.
     * @throws {ActionNotPerformedException} - If the assignment with the given ID was not found.
     */
    async deleteAssignment(id: string): Promise<IDeleteResponse<Assignment>> {
        let deletedElements: Assignment;
        try {
            deletedElements = await this.getAssignmentById(id);
        } catch (err) {
            throw new ActionNotPerformedException(
                ActionObjectType.ASSIGNMENT,
                +id,
                ActionExceptionType.DELETE
            );
        }

        const affectedRows = (await this._assignmentRepo.delete(id)).affected;
        return {
            affectedRows,
            deletedElements,
        };
    }

    /**
     * Update an Assignment by ID.
     * @param id - The ID of the Assignment.
     * @param assignment - The Assignment data to update.
     * @returns A Promise that resolves to the updated Assignment.
     * @throws {ActionNotPerformedException} - If the assignment with the given ID was not found.
     */
    async updateAssignment(
        id: string,
        assignment: AssignmentDto
    ): Promise<Assignment> {
        let updatedElements: Assignment;
        try {
            updatedElements = await this.getAssignmentById(id);
        } catch (err) {
            throw new ActionNotPerformedException(
                ActionObjectType.ASSIGNMENT,
                +id,
                ActionExceptionType.UPDATE
            );
        }
        return await this._assignmentRepo.save({
            ...updatedElements,
            ...assignment,
        });
    }
}
