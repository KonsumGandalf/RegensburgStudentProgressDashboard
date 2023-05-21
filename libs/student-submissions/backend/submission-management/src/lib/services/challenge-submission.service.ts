import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
	AssignmentService,
	ChallengeService,
} from '@rspd/challenge-management/backend/challenge-management';
import { Assignment } from '@rspd/challenge-management/backend/common-models';
import { addIfNotContained, GenericRepositoryService } from '@rspd/shared/backend/utils';
import {
	AssignmentSubmission,
	ChallengeSubmission,
	ISubmissionServices,
	submissionStateCalculator,
} from '@rspd/student-submissions/backend/common-models';
import { SubmissionState } from '@rspd/student-submissions/backend/common-models';
import { In, Repository } from 'typeorm';

@Injectable()
export class ChallengeSubmissionService
	extends GenericRepositoryService<ChallengeSubmission>
	implements ISubmissionServices<ChallengeSubmission>
{
	constructor(
		private readonly _assignmentService: AssignmentService,
		private readonly _challengeService: ChallengeService,
		@InjectRepository(ChallengeSubmission)
		private readonly _challengeSubmissionRepository: Repository<ChallengeSubmission>,
	) {
		super(_challengeSubmissionRepository);
	}

	async getChallengeSubmissionByUserAssignmentId(
		id: string,
		username: string,
	): Promise<ChallengeSubmission> {
		const challenge = await this._assignmentService.getChallengeByAssignmentId(id);
		return await this._challengeSubmissionRepository.findOne({
			where: {
				challenge: {
					id: challenge.id,
				},
				student: {
					username: username,
				},
			},
			relations: ['student', 'submissions', 'challenge'],
		});
	}

	async getUserSolvedElements(username: string): Promise<ChallengeSubmission[]> {
		return await this._challengeSubmissionRepository.find({
			where: {
				student: {
					username: username,
				},
				completionState: In([SubmissionState.Solved, SubmissionState.CompletelySolved]),
			},
		});
	}

	async getUserChallengeSubmissions(username: string): Promise<ChallengeSubmission[]> {
		const submissions = await this.findOptionsMany({
			where: {
				student: {
					username: username,
				},
			},
			relations: [
				'challenge',
				'student',
				'submissions',
				'challenge.assignments',
				'challenge.submissions',
			],
		});
		return await Promise.all(
			submissions.map(async (submission: ChallengeSubmission) => {
				const processedAssignmentSubmissions = await Promise.all(
					submission.submissions.map(
						async (assignmentSubmission: AssignmentSubmission) => {
							const assignment = (
								await this._assignmentService.findOptionsMany({
									where: {
										challenge: {
											id: submission.challenge.id,
										},
									} as Assignment,
									relations: ['submissions'],
								})
							).find((ele) =>
								ele.submissions.find((submission) => {
									if (submission.id == assignmentSubmission.id) {
										return submission;
									}
								}),
							);
							return {
								...assignmentSubmission,
								assignment: assignment,
							};
						},
					),
				);
				return {
					...submission,
					submissions: processedAssignmentSubmissions,
				} as ChallengeSubmission;
			}),
		);
	}

	async createOrUpdateChallengeSubmission(assignmentSubmission: AssignmentSubmission) {
		const challengeSubmission = await this.getChallengeSubmissionByUserAssignmentId(
			assignmentSubmission.assignment.id,
			assignmentSubmission.student.username,
		);
		if (!challengeSubmission) {
			return await this.create({
				challenge: assignmentSubmission.assignment.challenge,
				student: assignmentSubmission.student,
				submissions: [assignmentSubmission],
			} as ChallengeSubmission);
		}

		return await this.updateChallengeStateAndConnection(
			challengeSubmission,
			assignmentSubmission,
		);
	}

	async updateChallengeStateAndConnection(
		challengeSubmission: ChallengeSubmission,
		assignmentSubmission: AssignmentSubmission,
	) {
		const submissions = addIfNotContained(
			challengeSubmission.submissions,
			assignmentSubmission,
		);
		const solvedCount = submissions.reduce(
			(count: number, assignmentSubmission: AssignmentSubmission) => {
				if (assignmentSubmission.completionState != SubmissionState.Unsolved) {
					return count + 1;
				}
				return count;
			},
			0,
		);
		const toBeSolvedCount = await this._challengeService
			.getChallengeEagerly(challengeSubmission.challenge.id)
			.then((item) => item.assignments.length);

		const updatedSubmission = {
			...challengeSubmission,
			completionState: submissionStateCalculator(solvedCount, toBeSolvedCount),
			submissions: submissions,
		} as ChallengeSubmission;
		await super.update(challengeSubmission.id, updatedSubmission);
		return updatedSubmission;
	}
}
