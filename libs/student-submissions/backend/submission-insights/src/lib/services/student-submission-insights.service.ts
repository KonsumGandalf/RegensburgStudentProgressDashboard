import { Injectable } from '@nestjs/common';
import {
	AssignmentService,
	ChallengeService,
} from '@rspd/challenge-management/backend/challenge-management';
import { Assignment } from '@rspd/challenge-management/backend/common-models';
import { AssignmentType } from '@rspd/shared/backend/utils';
import {
	AssignmentSubmission,
	ChallengeSubmission,
	SubmissionState,
	TestOutcome,
} from '@rspd/student-submissions/backend/common-models';
import { GithubTestService } from '@rspd/student-submissions/backend/github-submissions';
import { GithubSubmissionService } from '@rspd/student-submissions/backend/github-submissions';
import {
	AssignmentSubmissionService,
	ChallengeSubmissionService,
} from '@rspd/student-submissions/backend/submission-management';
import {
	IAbsoluteProgressOverview,
	IAssignmentDetail,
	IAssignmentOverview,
	IChallengesOverview,
	IChallengeSubmissionOverview,
} from '@rspd/student-submissions/common/models';
import { UserService } from '@rspd/user/backend/user-management';

/**
 * Service for retrieving insights and information about student submissions.
 */
@Injectable()
export class StudentSubmissionInsightsService {
	constructor(
		private readonly _assignmentSubmissionService: AssignmentSubmissionService,
		private readonly _challengeSubmissionService: ChallengeSubmissionService,
		private readonly _githubTestService: GithubTestService,
		private readonly _githubSubmissionService: GithubSubmissionService,
		private readonly _challengesService: ChallengeService,
		private readonly _assignmentService: AssignmentService,
		private readonly _userService: UserService,
	) {}

	/**
	 * Retrieves the absolute progress figures for a specific user.
	 *
	 * @param username The username of the user.
	 * @returns A Promise that resolves to an object containing the absolute progress overview.
	 */
	async getAbsoluteProgressOverview(username: string): Promise<IAbsoluteProgressOverview> {
		const allChallenges = await this._challengesService.findAll();
		const allAssignments = await this._assignmentService.findAll();
		const numberOfAllTest = allAssignments.reduce(
			(totalValue: number, currentValue: Assignment) => {
				return totalValue + currentValue.totalTests;
			},
			0,
		);
		const userSolvedChallenges = await this._challengeSubmissionService.getUserSolvedElements(
			username,
		);

		const userSolvedAssignments = await this._assignmentSubmissionService.getUserSolvedElements(
			username,
		);
		const userSolvedTests = await this._githubTestService.getSolvedUserTests(username);
		return {
			test: {
				all: numberOfAllTest,
				solved: userSolvedTests.length,
			},
			assignment: {
				all: allAssignments.length,
				solved: userSolvedAssignments.length,
			},
			challenge: {
				all: allChallenges.length,
				solved: userSolvedChallenges.length,
			},
		};
	}

	/**
	 * Retrieves an overview for all challenges for the requesting user.
	 *
	 * @param username The username of the user.
	 * @returns A Promise that resolves to an object containing the challenge overview.
	 */
	async getChallengeOverview(username: string): Promise<IChallengesOverview> {
		const allChallengesPromise = this._challengesService.findOptionsMany({
			relations: ['assignments'],
		});
		const userChallengeSubmissionsPromise =
			this._challengeSubmissionService.getUserChallengeSubmissions(username);

		const [allChallenges, userChallengeSubmissions] = await Promise.all([
			allChallengesPromise,
			userChallengeSubmissionsPromise,
		]);

		const results: IChallengeSubmissionOverview[] = await Promise.all(
			allChallenges.map(async (challenge) => {
				const foundChallengeSubmission = userChallengeSubmissions.find(
					(submission) => submission.challenge.id == challenge.id,
				);
				const numberOfSolvedChallenges = foundChallengeSubmission?.submissions?.filter(
					(submission) => submission.completionState == SubmissionState.Solved,
				).length;

				const promiseAssignmentSubmissions = challenge.assignments.map(async (assignment) =>
					this.getAssignmentRelatedInformation(assignment, foundChallengeSubmission),
				);

				const assignmentSubmissions: IAssignmentOverview[] = await Promise.all(
					promiseAssignmentSubmissions,
				);
				return {
					name: challenge.name,
					targetedCompletionDate: challenge.targetedCompletionDate,
					completionState:
						foundChallengeSubmission?.completionState || SubmissionState.Unsolved,
					challengeScore: {
						all: challenge.assignments.length,
						solved: numberOfSolvedChallenges || 0,
					},
					assignments: assignmentSubmissions.sort((a, b) => +a.id - +b.id),
				} as IChallengeSubmissionOverview;
			}),
		);
		return {
			challenges: results,
		} as IChallengesOverview;
	}

	/**
	 * Retrieves all information about the different types of assignment submissions f.e. GithubSubmission
	 * and transforms them to the interface `IAssignmentOverview`
	 *
	 * @param assignment The assignment entity
	 * @param foundChallengeSubmission The name of the assignment.
	 * @returns A Promise that resolves to an object containing the assignment details.
	 */
	async getAssignmentRelatedInformation(
		assignment: Assignment,
		foundChallengeSubmission: ChallengeSubmission,
	): Promise<IAssignmentOverview> {
		const assignmentSubmission = foundChallengeSubmission?.submissions?.find(
			(submission) => submission.assignment.id == assignment.id,
		);
		const numberOfSolvedTests = assignmentSubmission
			? await this._githubTestService.getNumberOfSolvedTests(assignmentSubmission.id)
			: 0;

		return {
			id: assignment.id,
			name: assignment.name,
			displayName: assignment.displayName,
			topics: assignment.topics,
			completionState: assignmentSubmission?.completionState || SubmissionState.Unsolved,
			assignmentScore: {
				all: assignment.totalTests,
				solved: numberOfSolvedTests,
			},
		};
	}

	/**
	 * Retrieves the details of an assignment submission.
	 *
	 * @param username The unique name of the user.
	 * @param assignmentName The unique name of the assignment.
	 * @returns A Promise that resolves to an object containing the assignment details.
	 */
	async getAssignmentSubmissionDetails(
		username: string,
		assignmentName: string,
	): Promise<IAssignmentDetail> {
		const promiseAllStudents = this._userService.findAllStudents();
		const promiseSolvedSubmissions =
			this._assignmentSubmissionService.getAllSolvedSubmissions();
		const promiseAssignmentSubmission = this._assignmentSubmissionService.getSubmissionOfUser(
			username,
			assignmentName,
		);

		const [solvedSubmissions, assignmentSubmission, allStudents] = await Promise.all([
			promiseSolvedSubmissions,
			promiseAssignmentSubmission,
			promiseAllStudents,
		]);

		let assignmentInformation = {
			id: assignmentSubmission.assignment.id,
			name: assignmentSubmission.assignment.name,
			displayName: assignmentSubmission.assignment.displayName,
			topics: assignmentSubmission.assignment.topics,
			assignmentType: assignmentSubmission.assignment.type,
			tutorsUrl: assignmentSubmission.assignment.tutorsUrl,
			submissionPlatformUrl: new URL(assignmentSubmission.assignment.repositoryUrl),
			completionState: assignmentSubmission.completionState,
		} as IAssignmentDetail;

		if (assignmentInformation.assignmentType == AssignmentType.GITHUB) {
			assignmentInformation = await this.addGithubInformation(
				assignmentInformation,
				assignmentSubmission,
			);
		}

		const challengeSubmission = await this._challengesService.getChallengeByAssignmentId(
			assignmentSubmission.id,
		);

		return {
			...assignmentInformation,
			targetedCompletionDate: challengeSubmission.targetedCompletionDate,
			allStudents: {
				all: allStudents.length,
				solved: solvedSubmissions.length,
			},
		} as IAssignmentDetail;
	}

	/**
	 * Adds specific information for GitHub submissions to the assignment details.
	 *
	 * @param assignmentInformation The assignment details object.
	 * @param assignmentSubmission The assignment submission.
	 * @returns A Promise that resolves to the assignment details object with added GitHub information.
	 */
	async addGithubInformation(
		assignmentInformation: IAssignmentDetail,
		assignmentSubmission: AssignmentSubmission,
	): Promise<IAssignmentDetail> {
		const githubTests = await this._githubSubmissionService.getTestsOfSubmission(
			assignmentSubmission.id,
		);
		return {
			...assignmentInformation,
			assignmentScore: {
				all: assignmentSubmission.assignment.totalTests,
				solved: githubTests.filter((test) => test.outcome == TestOutcome.PASSED).length,
			},
			tests: githubTests,
		};
	}
}
