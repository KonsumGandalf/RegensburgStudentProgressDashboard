import { IsNumber, IsOptional } from 'class-validator';

import { AssignmentDto } from './assignment.dto';

export class MoodleAssignmentDto extends AssignmentDto {
	@IsOptional()
	@IsNumber()
	moodleAssignmentId: number;
}
