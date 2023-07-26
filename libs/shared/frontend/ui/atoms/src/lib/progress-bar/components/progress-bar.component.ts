import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

import { COMPLETION_COLOR_MAP } from '../models/completion-color-map';
import { IProgressBar } from '../models/progress-bar.interface';



@Component({
	selector: 'a-rspd-progress-bar',
	standalone: true,
	imports: [],
	templateUrl: './progress-bar.component.html',
	styleUrls: ['./progress-bar.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'a-rspd-progress-bar'
	}
})
export class RspdProgressBarComponent {
	@Input({ required: true })
	progressInput!: IProgressBar;

	@HostBinding('class')
	get isCompleted() {
		return `progress--${COMPLETION_COLOR_MAP[this.progressInput.state]}`;
	}

	@HostBinding('style.--progress-percentage')
	get isPercentage() {
		return `${(this.progressInput.current / this.progressInput.total * 100)}%`;
	}
}
