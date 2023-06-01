import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
@Component({
	selector: 'a-rspd-progress-bar',
	standalone: true,
	imports: [],
	templateUrl: './progress-bar.component.html',
	styleUrls: ['./progress-bar.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RspdProgressBarComponent {
	@Input({ required: true })
	current!: number;

	@Input({ required: true })
	total!: number;

	@Input()
	@HostBinding('class.progress--completed')
	isCompleted = false;

	@HostBinding('style.--progress-percentage')
	get isActive() {
		console.log(this.current / this.total * 100);
		return `${(this.current / this.total * 100)}%`;
	}
}
