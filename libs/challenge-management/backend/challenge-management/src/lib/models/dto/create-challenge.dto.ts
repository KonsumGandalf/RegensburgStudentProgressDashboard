import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';

import { AssignmentDto } from './assignment.dto';
import { ChallengeDto } from './challenge.dto';
import { GithubAssignmentDto } from './github-assignment.dto';
import { MoodleAssignmentDto } from './moodle-assignment.dto';

/**
 * Data transfer object for representing a challenge.
 */
export class CreateChallengeDto extends ChallengeDto {
	/**
	 * An array of assignments for the challenge.
	 * @type {AssignmentDto[]}
	 */
	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => AssignmentDto, {
		keepDiscriminatorProperty: true,
		discriminator: {
			property: 'type',
			subTypes: [
				{ value: MoodleAssignmentDto, name: 'MOODLE' },
				{ value: GithubAssignmentDto, name: 'GITHUB' },
			],
		},
	})
	assignments: (MoodleAssignmentDto | GithubAssignmentDto)[];

	@IsOptional()
	@IsNumber()
	moodleCourseId?: number;
}
