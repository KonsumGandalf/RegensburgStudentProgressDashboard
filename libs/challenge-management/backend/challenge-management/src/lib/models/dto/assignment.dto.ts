import {
    AssignmentTopic,
    AssignmentType,
    IsGreaterOrEqualValidator,
    IsSmallerOrEqualValidator,
} from '@rspd/shared/backend/utils';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    IsUrl,
    Max,
    Min,
} from 'class-validator';

/**
 * Data transfer object for representing an assignment.
 */
export class AssignmentDto {
    /**
     * The type of the assignment.
     * @type {AssignmentType}
     */
    @IsEnum(AssignmentType)
    type: AssignmentType;

    /**
     * The name of the assignment.
     * @type {string}
     */
    @IsString()
    name: string;

    /**
     * The topics of the assignment.
     * @type {AssignmentTopic[]}
     */
    @IsOptional()
    @IsEnum(AssignmentTopic, { each: true })
    topics: AssignmentTopic[];

    /**
     * The URL of the repository for the assignment.
     * @type {URL}
     *
     * @example https://github.com/
     */
    @IsUrl()
    repositoryUrl: URL;

    /**
     * The URL of the tutors for the assignment.
     * @type {URL}
     * @example https://reader.tutors.dev/
     */
    @IsUrl()
    tutorsUrl: URL;

    /**
     * The minimum number of tests that must pass for the assignment to be considered successful.
     * @type {number}
     * @param {number} value - The value of the property must be smaller than the value of totalTests.
     */
    @IsInt()
    @Min(1)
    @IsSmallerOrEqualValidator('minPassedTests', {
        message:
            'The total amount of tests must be greater than the minimum amount of passing tests',
    })
    minPassedTests: number;

    /**
     * The total number of tests for the assignment.
     * @type {number}
     * @param {number} value - The value of the property must be greater than the value of minPassedTests.
     */
    @IsInt()
    @Max(10)
    @IsGreaterOrEqualValidator('minPassedTests', {
        message:
            'The total amount of tests must be greater than the minimum amount of passing tests',
    })
    totalTests: number;
}
