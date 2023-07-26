import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
	CardAppearance, CardPadding, IconSize,
	IProgressBar,
	RspdCardComponent,
	RspdIconComponent,
	RspdProgressBarComponent,
	TopicIcons,
} from '@rspd/shared/frontend/ui/atoms';

@Component({
	selector: 'm-rspd-assignment-overview',
	standalone: true,
	imports: [CommonModule, RspdCardComponent, RspdProgressBarComponent, RspdIconComponent],
	templateUrl: './assignment-overview.component.html',
	styleUrls: ['./assignment-overview.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'm-rspd-assignment-overview',
	},
})
export class RspdAssignmentOverviewComponent {
	outline = CardAppearance.OUTLINED;
	padding = CardPadding.NONE;
	iconSize = IconSize.MD;

	/**
	 * The name of the assignment
	 */
	@Input({ required: true })
	name!: string;

	/**
	 * The name of the assignment
	 */
	@Input({ required: true })
	icon!: TopicIcons;

	/**
	 * The progress in the assignment
	 */
	@Input({ required: true })
	progress!: IProgressBar;
}
