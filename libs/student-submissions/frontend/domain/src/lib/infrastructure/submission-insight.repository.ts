import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AssignmentTopic } from '@rspd/shared/backend/utils';
import { ENVIRONMENT, IEnvironment } from '@rspd/shared/frontend/environment';
import { IAbsoluteProgressOverview, IAssignmentDetail, IChallengesOverview } from '@rspd/student-submissions/common/models';
import { AuthService } from '@rspd/user/frontend/auth';
import { Observable } from 'rxjs';

/**
 * Repository service to communicate with the backend
 */
@Injectable({ providedIn: 'root' })
export class SubmissionInsightRepository {
    private readonly _authRoute: string;

    constructor(
        private readonly _httpClient: HttpClient,
        private readonly _authService: AuthService,
        @Inject(ENVIRONMENT) readonly _environment: IEnvironment
    ) {
        this._authRoute = `${this._environment.apiUrl}/submission/insight`;
    }

    getChallengeOverview(): Observable<IChallengesOverview> {
        return this._httpClient
            .get<IChallengesOverview>(`${this._authRoute}/challenge-overview`);
    }

    getAbsoluteProgressOverview(): Observable<IAbsoluteProgressOverview> {
        return this._httpClient
            .get<IAbsoluteProgressOverview>(`${this._authRoute}/absolute-progress-overview`);
    }

    getTopicProgress(): Observable<Partial<Record<AssignmentTopic, number>>> {
        return this._httpClient
            .get<Partial<Record<AssignmentTopic, number>>>(`${this._authRoute}/topic-progress`);
    }

    getAssignmentSubmissionDetails(assignmentName: string): Observable<IAssignmentDetail> {
        return this._httpClient
            .get<IAssignmentDetail>(`${this._authRoute}/assignments/${assignmentName}`);
    }

}
