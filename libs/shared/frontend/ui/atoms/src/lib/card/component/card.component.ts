import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	Input,
	ViewEncapsulation,
} from '@angular/core';

import { CardAppearance } from '../models/card-appearance';

/**
 * Component for displaying a content inside a card
 */
@Component({
	selector: 'a-rspd-card',
	standalone: true,
	imports: [CommonModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.scss'],
	host: {
		class: 'a-rspd-card card',
	},
})
export class RspdCardComponent {
	/**
	 * Sets the appearance of the icon.
	 * @param {PhosphorIcons} iconName - The name of the icon appearance.
	 */
	@Input()
	appearance: CardAppearance = CardAppearance.RAISED;

	@HostBinding('class.a-rspd-card--raised')
	get isRaised(): boolean {
		return this.appearance === CardAppearance.RAISED;
	}

	@HostBinding('class.a-rspd-card--solid')
	get isSolid(): boolean {
		return this.appearance === CardAppearance.SOLID;
	}

	@HostBinding('class.a-rspd-card--outlined')
	get isOutlined(): boolean {
		return this.appearance === CardAppearance.OUTLINED;
	}
}
