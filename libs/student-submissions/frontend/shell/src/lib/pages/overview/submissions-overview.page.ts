import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { SubmissionState } from '@rspd/student-submissions/common/models';

/**
 * Page which displays organisms related to the student-submissions domain
 */
@Component({
	selector: 'p-rspd-submissions-overview',
	templateUrl: './student-submissions.page.html',
	styleUrls: ['./submissions-overview.page.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'p-rspd-submissions-overview',
	},
})
export class RspdSubmissionsOverviewPage {

}
