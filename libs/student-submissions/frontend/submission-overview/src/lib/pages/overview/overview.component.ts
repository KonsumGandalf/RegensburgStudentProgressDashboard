import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IAbsoluteProgressOverview } from '@rspd/student-submissions/common/models';
import { SubmissionInsightFacade } from '@rspd/student-submissions/frontend/domain';

@Component({
    selector: 'o-rspd-overview',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
})
export class RspdOverviewPage {
    $absoluteProgress: Signal<IAbsoluteProgressOverview>;

    constructor(private readonly _submissionInsightFacade: SubmissionInsightFacade) {
        this.$absoluteProgress = toSignal(
            this._submissionInsightFacade.getAbsoluteProgressOverview(),
            { initialValue: undefined }
        );
    }

}
