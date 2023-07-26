import { Injectable } from '@angular/core';
import { IAbsoluteProgressOverview, IChallengesOverview } from '@rspd/student-submissions/common/models';
import { IResponseAuthentication } from '@rspd/user/common/models';
import { Observable } from 'rxjs';

import { SubmissionInsightRepository } from '../../infrastructure/submission-insight.repository';

@Injectable({ providedIn: 'root' })
export class SubmissionInsightFacade {
    constructor(private readonly _insightRepository: SubmissionInsightRepository) {
    }

    getAbsoluteProgressOverview(): Observable<IAbsoluteProgressOverview> {
        return this._insightRepository.getAbsoluteProgressOverview();
    }

    getChallengeOverview(): Observable<IChallengesOverview> {
        return this._insightRepository.getChallengeOverview();
    }
}
