import { Controller, Get, Param } from '@nestjs/common';

import { MoodleManagementService } from '../services/moodle-management.service';

/**
 * This Controller is deleted when in production, now it's simply used for testing while in development.
 */
@Controller()
export class MoodleManagementController {
	constructor(private readonly managementService: MoodleManagementService) {}

	@Get('mail/:email')
	async searchUserByEmail(@Param('email') email: string) {
		return await this.managementService.getUserByEmail(email);
	}

	@Get('assignment/:id')
	async findAssignmentsOfMoodle(@Param('id') id: number) {
		return await this.managementService.getAssignmentsWithCourse(id);
	}

	@Get('grade/:id')
	async getGradesOfAssignment(@Param('id') id: number) {
		return await this.managementService.getGradesOfAssignment(id);
	}
}
