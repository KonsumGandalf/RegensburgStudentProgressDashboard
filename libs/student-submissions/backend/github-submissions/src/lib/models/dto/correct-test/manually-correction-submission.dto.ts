import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

import { ManuallyUpdateTestDto } from './manually-update-test.dto';

export class ManuallyCorrectionSubmissionDto {
	@IsString()
	assigment: string;
	@IsString()
	student: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ManuallyUpdateTestDto)
	tests: ManuallyUpdateTestDto[];
}
