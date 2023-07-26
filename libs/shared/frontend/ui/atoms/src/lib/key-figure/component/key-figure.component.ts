import { NgForOf, NgIf } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component, Input,
	ViewEncapsulation,
} from '@angular/core';

import { IKeyFigure } from '../models/key-figure.interface';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'a-rspd-key-figure',
	standalone: true,
	templateUrl: './key-figure.component.html',
	styleUrls: ['./key-figure.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'a-rspd-key-figure',
	},
	imports: [NgIf, NgForOf],
})
export class RspdKeyFigureComponent {
	@Input({required: true})
	keyFigureInput!: IKeyFigure;
}
