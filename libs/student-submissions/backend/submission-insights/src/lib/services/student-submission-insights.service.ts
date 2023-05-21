import { Injectable } from '@nestjs/common';
import {
	AssignmentService,
	ChallengeService,
} from '@rspd/challenge-management/backend/challenge-management';
import {
	Assignment,
	GithubAssignment,
	UnionAssignment,
} from '@rspd/challenge-management/backend/common-models';
import { AssignmentTopic, AssignmentType } from '@rspd/shared/backend/utils';
import {
	AssignmentSubmission,
	ChallengeSubmission,
	SubmissionState,
} from '@rspd/student-submissions/backend/common-models';
import {
	GithubSubmissionService,
	GithubTestService,
} from '@rspd/student-submissions/backend/github-submissions';
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
	IScoreOf,
} from '@rspd/student-submissions/common/models';
import { StudentService } from '@rspd/user/backend/user-management';

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
		private readonly _studentService: StudentService,
	) {}

	/**
	 * Retrieves the absolute progress figures for a specific user.
	 *
	 * @param username The username of the user.
	 * @returns A Promise that resolves to an object containing the absolute progress overview.
	 */
	async getAbsoluteProgressOverview(username: string): Promise<IAbsoluteProgressOverview> {
		const student = await this._studentService.getStudentEagerly(username);
		const allChallenges = await this._challengesService.getChallengesOfSemester(
			student.semester.name,
		);
		const allAssignments: Assignment[] = allChallenges.flatMap(
			(challenge) => challenge.assignments,
		);
		const numberOfAllTests = allAssignments.reduce(
			(totalValue: number, currentValue: UnionAssignment) => {
				if (currentValue?.type == AssignmentType.GITHUB) {
					return totalValue + (currentValue as GithubAssignment).totalTests;
				}
				return totalValue + 1;
			},
			0,
		);

		const userSolvedChallenges = await this._challengeSubmissionService.getUserSolvedElements(
			username,
		);

		const userSolvedAssignments = await this._assignmentSubmissionService.getUserSolvedElements(
			username,
		);

		const userSolvedGithubTests = await this._githubTestService
			.getSolvedUserTests(username)
			.then((ele) => ele.length);
		const userSolvedMoodleTests = userSolvedAssignments.filter(
			(submission) => submission instanceof AssignmentSubmission,
		).length;
		const numberOfSolvedTests = userSolvedGithubTests + userSolvedMoodleTests;
		return {
			test: {
				all: numberOfAllTests,
				solved: numberOfSolvedTests,
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
	 * Calculates the progress for every AssignmentTopic for a user
	 *
	 * @param username - The username of the Student requesting the progress
	 * @returns A Promise that resolves to an object containing a score for each AssignmentTopic.
	 */
	async getTopicProgress(username: string): Promise<Partial<Record<AssignmentTopic, number>>> {
		const student = await this._studentService.getStudentEagerly(username);
		const allAssignments = await this._assignmentService.findAllAssignments(
			student.semester.name,
		);
		const userSolvedAssignments = await this._assignmentSubmissionService.getUserSolvedElements(
			username,
		);

		const topicProgressMap: Map<AssignmentTopic, number> = new Map(
			Object.values(AssignmentTopic).map((topic: AssignmentTopic) => [topic, 0]),
		);

		Object.values(AssignmentTopic).forEach((topic: AssignmentTopic) => {
			const allTopicAssignments = allAssignments.filter((assignment) =>
				assignment.topics.includes(topic),
			);
			const allSolvedAssignments = userSolvedAssignments.filter((submission) =>
				submission.assignment.topics.includes(topic),
			);

			const numberOfTopicAssignment =
				Array.isArray(allTopicAssignments) && allTopicAssignments.length > 0
					? allTopicAssignments.length
					: 1;
			const numberOfSolvedAssignments = Array.isArray(allSolvedAssignments)
				? allSolvedAssignments.length
				: 0;
			topicProgressMap.set(
				topic,
				+(numberOfSolvedAssignments / numberOfTopicAssignment).toFixed(2),
			);
		});

		return Object.fromEntries(topicProgressMap);
	}

	/**
	 * Retrieves an overview for all challenges for the requesting user.
	 *
	 * @param username The username of the user.
	 * @returns A Promise that resolves to an object containing the challenge overview.
	 */
	async getChallengeOverview(username: string): Promise<IChallengesOverview> {
		const student = await this._studentService.getStudentEagerly(username);
		const allChallengesPromise = this._challengesService.getChallengesOfSemester(
			student.semester.name,
		);
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

				let assignmentSubmissions: IAssignmentOverview[] = undefined;
				let numberOfSolvedChallenges = 0;
				if (foundChallengeSubmission) {
					numberOfSolvedChallenges = foundChallengeSubmission.submissions?.reduce(
						(count: number, assignmentSubmission: AssignmentSubmission) => {
							if (assignmentSubmission.completionState != SubmissionState.Unsolved) {
								return count + 1;
							}
							return count;
						},
						0,
					);
				}

				const promiseAssignmentSubmissions = challenge.assignments.map(async (assignment) =>
					this.getAssignmentRelatedInformation(
						assignment,
						foundChallengeSubmission,
						username,
					),
				);

				assignmentSubmissions = await Promise.all(promiseAssignmentSubmissions);
				assignmentSubmissions.sort((a, b) => +a.id - +b.id);

				return {
					name: challenge.name,
					targetedCompletionDate: challenge.targetedCompletionDate,
					completionState:
						foundChallengeSubmission?.completionState || SubmissionState.Unsolved,
					challengeScore: {
						all: challenge.assignments.length,
						solved: numberOfSolvedChallenges,
					},
					assignments: assignmentSubmissions,
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
	 * @param username
	 * @returns A Promise that resolves to an object containing the assignment details.
	 */
	async getAssignmentRelatedInformation(
		assignment: UnionAssignment,
		foundChallengeSubmission: ChallengeSubmission,
		username: string,
	): Promise<IAssignmentOverview> {
		const assignmentSubmission = foundChallengeSubmission?.submissions?.find(
			(submission) => submission.assignment.id == assignment.id,
		);

		return {
			id: assignment.id,
			name: assignment.name,
			displayName: assignment.displayName,
			topics: assignment.topics,
			completionState: assignmentSubmission?.completionState || SubmissionState.Unsolved,
			assignmentScore: await this.getAssignmentScore(assignment, assignmentSubmission),
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
		const promiseAllStudents = this._studentService.findAll();
		const promiseSolvedSubmissions =
			this._assignmentSubmissionService.getAllSolvedSubmissions(assignmentName);
		const promiseAssignment = this._assignmentService.getAssignmentByName(assignmentName);
		const promiseAssignmentSubmission = this._assignmentSubmissionService.getSubmissionOfUser(
			username,
			assignmentName,
		);

		const [solvedSubmissions, assignmentSubmission, assignment, allStudents] =
			await Promise.all([
				promiseSolvedSubmissions,
				promiseAssignmentSubmission,
				promiseAssignment,
				promiseAllStudents,
			]);

		let assignmentInformation = {
			id: assignment.id,
			name: assignment.name,
			displayName: assignment.displayName,
			topics: assignment.topics,
			assignmentType: assignment.type,
			tutorsUrl: assignment.tutorsUrl,
			repositoryUrl: new URL(assignment.repositoryUrl),
			completionState: assignmentSubmission?.completionState || SubmissionState.Unsolved,
		} as IAssignmentDetail;

		if (assignmentInformation.assignmentType == AssignmentType.GITHUB && assignmentSubmission) {
			assignmentInformation = await this.addGithubInformation(
				assignmentInformation,
				assignment,
				assignmentSubmission,
			);
		}

		const challenge = await this._challengesService.getChallengeByAssignmentId(assignment.id);

		return {
			...assignmentInformation,
			targetedCompletionDate: challenge.targetedCompletionDate,
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
	 * @param assignment
	 * @returns A Promise that resolves to the assignment details object with added GitHub information.
	 */
	async addGithubInformation(
		assignmentInformation: IAssignmentDetail,
		assignment: UnionAssignment,
		assignmentSubmission: AssignmentSubmission,
	): Promise<IAssignmentDetail> {
		const githubTests = await this._githubSubmissionService.getTestsOfSubmission(
			assignmentSubmission.id,
		);
		return {
			...assignmentInformation,
			assignmentScore: await this.getAssignmentScore(assignment, assignmentSubmission),
			tests: githubTests,
		};
	}

	async getAssignmentScore(
		assignment: UnionAssignment,
		assignmentSubmission: AssignmentSubmission,
	): Promise<IScoreOf> {
		let numberOfSolvedTests = 0;
		if (assignmentSubmission) {
			if (assignment.type == AssignmentType.GITHUB) {
				numberOfSolvedTests = await this._githubTestService.getNumberOfSolvedTests(
					assignmentSubmission.id,
				);
			} else {
				if (assignmentSubmission.completionState != SubmissionState.Unsolved) {
					numberOfSolvedTests++;
				}
			}
		}
		const allTests = assignment instanceof GithubAssignment ? assignment.totalTests : 1;

		return {
			all: allTests,
			solved: numberOfSolvedTests,
		};
	}
}
