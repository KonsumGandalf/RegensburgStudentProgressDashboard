import { Controller, Get, Param } from '@nestjs/common';

import { MoodleManagementService } from '../services/moodle-management.service';

@Controller()
export class MoodleManagementController {
	constructor(private readonly managementService: MoodleManagementService) {}

	@Get('mail/:email')
	async searchUserByEmail(@Param('email') email: string) {
		console.log(email);
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
