import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import {
	CardAppearance,
	IconColor,
	IProgressBar,
	PhosphorIcons,
	RspdButtonComponent,
	RspdCardComponent,
	RspdIconComponent,
	RspdLoadingIndicatorComponent,
	TopicIcons,
} from '@rspd/shared/frontend/ui/atoms';
import { IChallengeSubmissionOverview, SubmissionState } from '@rspd/student-submissions/common/models';
import { TOPIC_ICON_MAP } from '@rspd/student-submissions/frontend/common-models';

import {
	RspdAssignmentOverviewComponent,
} from '../../../../../../../shared/frontend/ui/molecules/src/lib/assignment-overview/assignment-overview.component';

@Component({
	selector: 'o-rspd-challenge-overview',
	templateUrl: './challenge-overview.component.html',
	styleUrls: ['./challenge-overview.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		CommonModule,
		RspdCardComponent,
		RspdButtonComponent,
		RspdLoadingIndicatorComponent,
		RspdIconComponent,
		RspdCardComponent,
		RspdAssignmentOverviewComponent,
	],
	host: {
		class: 'o-rspd-challenge-overview',
	},
})
export class RspdChallengeOverviewComponent {
	processedAssignments: {
		name: string;
		progress: IProgressBar;
		icon: TopicIcons;
	}[] = [];

	private _overviewInput: IChallengeSubmissionOverview;

	@Input({ required: true })
	set overviewInput(value: IChallengeSubmissionOverview) {
		this._overviewInput = value;

		if (value.completionState == SubmissionState.Solved) {
			this.icon.color = IconColor.MEDIUM_SUCCESS
		} else if (value.completionState == SubmissionState.CompletelySolved) {
			this.icon.color = IconColor.FULL_SUCCESS
		}

		for (const assignment of value.assignments) {
			this.processedAssignments.push({
				icon: TOPIC_ICON_MAP[assignment.topics[0]],
				name: assignment.displayName,
				progress: {
					state: assignment.completionState,
					current: assignment.assignmentScore.solved,
					total: assignment.assignmentScore.all,
				},
			});
		}
	}

	get overviewInput(): IChallengeSubmissionOverview {
		return this._overviewInput;
	}

	icon = {
		appearance: PhosphorIcons.CORRECT,
		color: IconColor.BLACK
	};
	outline = CardAppearance.OUTLINED;
}
