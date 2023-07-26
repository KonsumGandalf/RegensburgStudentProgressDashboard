import { Transform } from 'class-transformer';
import { IsDate } from 'class-validator';

export class SemesterDto {
	@Transform(({ value }) => value && new Date(value))
	@IsDate()
	start: Date;

	@Transform(({ value }) => value && new Date(value))
	@IsDate()
	end: Date;
}
