import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenericRepositoryService } from '@rspd/shared/backend/utils';
import { AssignmentSubmission, GithubTest } from '@rspd/student-submissions/backend/common-models';
import { TestOutcome } from '@rspd/student-submissions/backend/common-models';
import { Repository } from 'typeorm';

import { ManuallyUpdateTestDto } from '../models/dto/correct-test/manually-update-test.dto';
import { TestDto } from '../models/dto/submit/grad-test.dto';

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
	 * @param {AssignmentSubmission} submission - Submission entity
	 * @returns {Promise<GithubTest[]>} Array of GithubTest entities
	 */
	async createOrUpdateTests(
		tests: TestDto[],
		submission: AssignmentSubmission,
	): Promise<GithubTest[]> {
		const updatedTests = await Promise.all(
			tests.map(async (test: TestDto, localId: number) => {
				const foundTest = await this.findOptions({
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
				});

				const generalProperties = {
					outcome: test.outcome,
					errorMsg: test.call?.crash?.message,
					failedRuns: Number(test.outcome != TestOutcome.PASSED),
				};
				if (foundTest) {
					return await this._githubTestRepo.save({
						...foundTest,
						...generalProperties,
						failedRuns:
							foundTest.failedRuns + Number(test.outcome != TestOutcome.PASSED),
					});
				}

				return await this.create({
					...generalProperties,
					localId,
					submission: submission,
				});
			}),
		);

		return updatedTests as GithubTest[];
	}

	async getSolvedUserTests(username: string): Promise<GithubTest[]> {
		return await super.findOptionsMany({
			where: {
				submission: {
					student: {
						username: username,
					},
				},
				outcome: TestOutcome.PASSED,
			},
			relations: ['submission'],
		});
	}

	async manuallyUpdateTest(savedTests: GithubTest[], updatedTests: ManuallyUpdateTestDto[]) {
		const updatePromiseResults = [];

		for (const updatedTest of updatedTests) {
			const test = savedTests.find((test) => test.localId === updatedTest.localId);

			if (test) {
				updatePromiseResults.push(
					this.update(test.id, {
						...test,
						...updatedTest,
					} as GithubTest),
				);
			}
		}

		return Promise.all(updatePromiseResults);
	}

	async getNumberOfSolvedTests(id: string): Promise<number> {
		return await this.findOptionsMany({
			where: {
				submission: {
					id,
				},
				outcome: TestOutcome.PASSED,
			} as GithubTest,
		}).then((items) => items.length);
	}
}
