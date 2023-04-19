import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { IDeleteResponse } from '@rspd/shared/backend/utils';

import { ChallengeDto } from '../models/dto/challenge.dto';
import { CreateChallengeDto } from '../models/dto/create-challenge.dto';
import { Challenge } from '../models/entities/challenge.entity';
import { ChallengeService } from '../services/challenge.service';

@Controller()
@ApiTags('challenge')
export class ChallengeController {
    constructor(private readonly _challengeService: ChallengeService) {}

    /**
     * Creates a new challenge with its assignments
     * @param {CreateChallengeDto} challenge - The challenge data
     * @returns {Promise<Challenge>} The created challenge with its assignments
     */
    @Post()
    @ApiCreatedResponse({ description: 'Challenge was created' })
    async createChallenge(
        @Body() challenge: CreateChallengeDto
    ): Promise<Challenge> {
        return this._challengeService.createChallengeAndAssignments(challenge);
    }

    /**
     * Retrieves a challenge by id
     * @param {string} id - The id of the challenge to retrieve
     * @returns {Promise<Challenge>} The retrieved challenge
     */
    @Get(':id')
    @ApiFoundResponse({ description: 'Challenge was found' })
    async getChallenge(@Param('id') id: string): Promise<Challenge> {
        return this._challengeService.getChallenge(id);
    }

    /**
     * Deletes a challenge by id
     * @param {string} id - The id of the challenge to delete
     * @returns {Promise<void>} A promise that resolves when the challenge is deleted
     */
    @Delete(':id')
    @ApiOkResponse({ description: 'Challenge was deleted' })
    async deleteChallenge(
        @Param('id') id: string
    ): Promise<IDeleteResponse<Challenge>> {
        return this._challengeService.deleteChallengeAndAssignment(id);
    }

    /**
     * Updates a challenge by id
     * @param {string} id - The id of the challenge to update
     * @param {ChallengeDto} challenge - The challenge data to update
     * @returns {Promise<Challenge>} The updated challenge
     */
    @Put(':id')
    @ApiCreatedResponse({ description: 'Challenge was updated' })
    async updateChallenge(
        @Param('id') id: string,
        @Body() challenge: ChallengeDto
    ): Promise<Challenge> {
        return this._challengeService.updateChallenge(id, challenge);
    }
}
