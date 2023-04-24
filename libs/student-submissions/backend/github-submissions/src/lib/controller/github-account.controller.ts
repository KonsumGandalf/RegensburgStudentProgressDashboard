import { Controller, Get, Query } from '@nestjs/common';

@Controller('github-submissions')
export class GithubSubmissionController {
    constructor(
        private readonly _githubSubmissionService: GithubSubmissionController
    ) {}
}
