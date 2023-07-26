import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenericRepositoryService, IResourceOwnerChecker } from '@rspd/shared/backend/utils';
import { AssignmentSubmission } from '@rspd/student-submissions/backend/common-models';
import { Repository } from 'typeorm';

@Injectable()
export class SubmissionService
	extends GenericRepositoryService<AssignmentSubmission>
	implements IResourceOwnerChecker
{
	constructor(
		@InjectRepository(AssignmentSubmission)
		private readonly _githubSubmissionRepo: Repository<AssignmentSubmission>,
	) {
		super(_githubSubmissionRepo);
	}

	async checkOwnership(id: string, username: string): Promise<boolean> {
		const submission = await super.findOptions({
			where: { id },
			relations: ['student'],
		});
		return submission.student.username === username;
	}

	async find(id: string): Promise<AssignmentSubmission> {
		return await super.findOptions({
			where: {
				id,
			},
			relations: ['tests'],
		});
	}
}
