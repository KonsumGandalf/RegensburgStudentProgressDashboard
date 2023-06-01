import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/**
 * Page which displays organisms related to the student-submissions domain
 */
@Component({
	selector: 'p-rspd-submissions-overview',
	templateUrl: './student-submissions.page.spec.html',
	styleUrls: ['./submissions-overview.page.spec.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'p-rspd-submissions-overview',
	},
})
export class RspdSubmissionsOverviewPage {}
