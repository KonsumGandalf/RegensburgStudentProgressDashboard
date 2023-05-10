import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { GenericRepositoryService } from '@rspd/shared/backend/utils';
import { Submission } from '@rspd/student-submissions/backend/common-models';
import { Repository } from 'typeorm';

import { TestDto } from '../models/dto/grad-test.dto';
import { GithubTest } from '../models/entities/github-test.entity';
import { TestOutcome } from '../models/enums/test-outcome.enum';

/**
 * Service which creates and updates GitHub tests
 */
@Injectable()
export class GithubTestService extends GenericRepositoryService<GithubTest> {
	constructor(
		@InjectRepository(GithubTest)
		private readonly _githubTestRepo: Repository<GithubTest>,
	) {
		super(_githubTestRepo);
	}

	/**
	 * Updates or creates GithubTest entities based on the TestDto array provided and a Submission entity
	 *
	 * @param {TestDto[]} tests - Array of TestDto
	 * @param {Submission} submission - Submission entity
	 * @returns {Promise<GithubTest[]>} Array of GithubTest entities
	 */
	async createOrUpdateTests(tests: TestDto[], submission: Submission): Promise<GithubTest[]> {
		const updatedTests = await Promise.all(
			tests.map(async (test: TestDto, localId: number) => {
				const foundTest = (
					await this._githubTestRepo.find({
						where: {
							localId,
							submission: {
								student: {
									id: submission.student.id,
								},
								assignment: {
									id: submission.assignment.id,
								},
							},
						},
						relations: ['submission'],
					})
				)[0];

				if (foundTest) {
					return await this._githubTestRepo.save({
						...foundTest,
						state: test.outcome,
						errorMsg: test.call?.crash?.message,
						failedRuns:
							foundTest.failedRuns + Number(test.outcome != TestOutcome.PASSED),
					});
				}

				return await super.create({
					localId,
					state: test.outcome,
					errorMsg: test.call?.crash?.message,
					submission: submission,
					failedRuns: Number(test.outcome != TestOutcome.PASSED),
				});
			}),
		);

		return updatedTests as GithubTest[];
	}
}
