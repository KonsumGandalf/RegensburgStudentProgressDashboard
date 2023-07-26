import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Request,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiFoundResponse,
	ApiOkResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Challenge } from '@rspd/challenge-management/backend/common-models';
import {
	IDeleteResponse,
	JwtAuthGuard,
	Role,
	RoleGuard,
	UserRole,
} from '@rspd/shared/backend/utils';
import { IRequestLogin } from '@rspd/user/backend/common-models';

import { ChallengeDto } from '../models/dto/challenge.dto';
import { CreateChallengeDto } from '../models/dto/create-challenge.dto';
import { ChallengeService } from '../services/challenge.service';

@Controller()
@ApiTags('challenge')
@ApiBearerAuth()
@Role(UserRole.TUTOR)
@UseGuards(JwtAuthGuard, RoleGuard)
export class ChallengeController {
	constructor(private readonly _challengeService: ChallengeService) {}

	/**
	 * Creates a new challenge with its assignments
	 * @param {CreateChallengeDto} challenge - The challenge data
	 * @param request
	 * @returns {Promise<Challenge>} The created challenge with its assignments
	 */
	@Post()
	@ApiCreatedResponse({ description: 'Challenge was created' })
	async createChallenge(
		@Body() challenge: CreateChallengeDto,
		@Request() request: IRequestLogin,
	): Promise<Challenge> {
		return this._challengeService.createChallengeAndAssignments(challenge, request.user.id);
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
	async deleteChallenge(@Param('id') id: string): Promise<IDeleteResponse<Challenge>> {
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
		@Body() challenge: ChallengeDto,
	): Promise<Challenge> {
		return this._challengeService.updateChallenge(id, challenge);
	}
}
