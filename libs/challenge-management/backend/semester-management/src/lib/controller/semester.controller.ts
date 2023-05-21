import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiFoundResponse,
	ApiOkResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Semester } from '@rspd/challenge-management/backend/common-models';
import {
	IDeleteResponse,
	JwtAuthGuard,
	Role,
	RoleGuard,
	UserRole,
} from '@rspd/shared/backend/utils';

import { SemesterDto } from '../models/semester.dto';
import { SemesterService } from '../services/semester.service';

@Controller()
@ApiTags('semester')
@ApiBearerAuth()
@Role(UserRole.TUTOR)
@UseGuards(JwtAuthGuard, RoleGuard)
export class SemesterController {
	constructor(private readonly _semesterService: SemesterService) {}

	/**
	 *
	 * @param semester
	 */
	@Post()
	@ApiCreatedResponse({ description: 'Semester was created' })
	async createSemester(@Body() semester: SemesterDto): Promise<Semester> {
		return await this._semesterService.createSemester(semester);
	}

	/**
	 * Retrieves a challenge by id
	 * @returns {Promise<Challenge>} The retrieved challenge
	 * @param name
	 */
	@Get(':name')
	@ApiFoundResponse({ description: 'Semester was found' })
	async getSemester(@Param('name') name: string): Promise<Semester> {
		return await this._semesterService.findByName(name);
	}

	/**
	 * Deletes a challenge by id
	 * @returns {Promise<IDeleteResponse<Semester>>} A promise that resolves when the challenge is deleted
	 * @param name
	 */
	@Delete(':name')
	@ApiOkResponse({ description: 'Semester was deleted' })
	async deleteSemester(@Param('name') name: string): Promise<IDeleteResponse<Semester>> {
		return await this._semesterService.deleteSemester(name);
	}

	/**
	 * Updates a challenge by id
	 * @returns {Promise<Challenge>} The updated challenge
	 * @param name
	 * @param semesterDto
	 */
	@Put(':name')
	@ApiCreatedResponse({ description: 'Semester was updated' })
	async updateSemester(
		@Param('name') name: string,
		@Body() semesterDto: SemesterDto,
	): Promise<Semester> {
		return await this._semesterService.updateSemester(name, semesterDto);
	}
}
