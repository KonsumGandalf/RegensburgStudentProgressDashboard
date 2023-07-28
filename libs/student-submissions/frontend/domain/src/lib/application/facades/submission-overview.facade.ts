import { Injectable } from '@angular/core';
import { AssignmentTopic } from '@rspd/shared/backend/utils';
import { IAbsoluteProgressOverview, IChallengesOverview } from '@rspd/student-submissions/common/models';
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

    getTopicProgress(): Observable<Partial<Record<AssignmentTopic, number>>> {
        return this._insightRepository.getTopicProgress();
    }
}
