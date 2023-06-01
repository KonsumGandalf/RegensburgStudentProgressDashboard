import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { IKeyFigure, RspdKeyFigureComponent } from '@rspd/shared/frontend/ui/atoms';

@Component({
	selector: 'm-rspd-absolute-digits',
	standalone: true,
	imports: [CommonModule, RspdKeyFigureComponent],
	templateUrl: './absolute-digits.component.html',
	styleUrls: ['./absolute-digits.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'm-rspd-absolute-digits',
	},
})
export class RspdAbsoluteDigitsComponent {
	@Input({required: true})
	absoluteDigits!: IKeyFigure[];
}
