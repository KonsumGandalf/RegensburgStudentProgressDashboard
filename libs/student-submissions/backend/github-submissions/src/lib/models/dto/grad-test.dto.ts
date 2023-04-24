import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

import { TestOutcome } from '../enums/test-outcome.enum';

export class GradTestDto {
    @IsEnum(TestOutcome)
    outcome: TestOutcome;

    @ValidateNested()
    @Type(() => CrashDto)
    call: CallDto;
}

export class CallDto {
    @IsOptional()
    @ValidateNested()
    @Type(() => CrashDto)
    crash: CrashDto;
}

export class CrashDto {
    @IsOptional()
    @IsString()
    message: string;
}
