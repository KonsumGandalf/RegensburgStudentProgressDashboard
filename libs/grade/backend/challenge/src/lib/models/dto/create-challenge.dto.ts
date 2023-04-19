import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';

import { AssignmentDto } from './assignment.dto';
import { ChallengeDto } from './challenge.dto';

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
    @Type(() => AssignmentDto)
    assignments: AssignmentDto[];
}
