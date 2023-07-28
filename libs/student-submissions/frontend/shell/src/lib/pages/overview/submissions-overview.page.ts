import { KeyValuePipe, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, Signal, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AssignmentTopic } from '@rspd/shared/backend/utils';
import {
    CardPadding,
    IKeyFigure,
    RspdCardComponent,
    RspdKeyFigureComponent,
    RspdRoundProgressBarComponent
} from '@rspd/shared/frontend/ui/atoms';
import {
    RspdAbsoluteDigitsComponent
} from '@rspd/shared/frontend/ui/molecules';
import {
    IAbsoluteProgressOverview, IChallengesOverview,
    IChallengeSubmissionOverview,
    IScoreOf,
    SubmissionState
} from '@rspd/student-submissions/common/models';
import { SubmissionInsightFacade } from '@rspd/student-submissions/frontend/domain';
import { RspdChallengeOverviewComponent } from '@rspd/student-submissions/frontend/submission-overview';
import { flatMap, map, mergeMap, tap } from 'rxjs';

/**
 * Page which displays organisms related to the student-submissions domain
 */
@Component({
    selector: 'p-rspd-submissions-overview',
    standalone: true,
    imports: [
        RspdAbsoluteDigitsComponent,
        RspdCardComponent,
        RspdChallengeOverviewComponent,
        NgForOf,
        RspdKeyFigureComponent,
        KeyValuePipe,
        RspdRoundProgressBarComponent
    ],
    templateUrl: './submission-overview.page.html',
    styleUrls: ['./submissions-overview.page.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'p-rspd-submissions-overview'
    }
})
export class RspdSubmissionsOverviewPage {
    protected readonly standardPadding = CardPadding.SM;
    $absoluteProgress: Signal<IKeyFigure[]>;
    $challengesOverview: Signal<IChallengeSubmissionOverview[]>;
    $topicProgress: Signal<Partial<Record<AssignmentTopic, number>>>;

    constructor(private readonly _submissionInsightFacade: SubmissionInsightFacade) {
        this.setAbsoluteProgress();
        this.setChallenges();
        this.setTopics();
    }

    setAbsoluteProgress() {
        const absoluteProgress = this._submissionInsightFacade.getAbsoluteProgressOverview()
            .pipe(
                map((overview: IAbsoluteProgressOverview): IKeyFigure[] => {
                    return [
                        {
                            label: 'test',
                            total: overview.test.all,
                            current: overview.test.solved
                        },
                        {
                            label: 'assignment',
                            total: overview.assignment.all,
                            current: overview.test.solved
                        },
                        {
                            label: 'challenge',
                            total: overview.challenge.all,
                            current: overview.challenge.solved
                        }
                    ];
                })
            );
        this.$absoluteProgress = toSignal(absoluteProgress, { initialValue: [] });
    }

    setChallenges() {
        this.$challengesOverview = toSignal(
            this._submissionInsightFacade.getChallengeOverview()
                .pipe(
                    map((overview: IChallengesOverview): IChallengeSubmissionOverview[] => overview.challenges)
                ),
            { initialValue: [] }
        );
    }

    setTopics() {
        this.$topicProgress = toSignal(
            this._submissionInsightFacade.getTopicProgress(),
            { initialValue: { } }
        )

    }

}
