import { DatePipe } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { PhosphorIcons, RspdIconComponent } from '@rspd/shared/frontend/ui/atoms';
import { IChallengeSubmissionOverview } from '@rspd/student-submissions/common/models';

@Component({
	selector: 'o-rspd-challenge-overview',
	templateUrl: './challenge-overview.component.html',
	styleUrls: ['./challenge-overview.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'o-rspd-challenge-overview',
	},
})
export class RspdChallengeOverviewComponent {
	@Input({ required: true })
	overviewInput!: IChallengeSubmissionOverview;
	icon: PhosphorIcons.CORRECT;
}
