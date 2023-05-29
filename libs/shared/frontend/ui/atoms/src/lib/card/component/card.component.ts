import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	Input,
	ViewEncapsulation,
} from '@angular/core';

import { RspdIconComponent } from '../../icon/component/icon.component';
import { CardAppearance } from '../models/card-appearance';
import { CardPadding } from '../models/card-padding';

/**
 * Component for displaying a content inside a card
 */
@Component({
	selector: 'a-rspd-card',
	standalone: true,
	imports: [CommonModule, RspdIconComponent],
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

	/**
	 * Sets the padding of the card.
	 * @param {CardPadding} padding - The padding of the card.
	 */
	@Input()
	@HostBinding('style.--card-padding')
	padding: CardPadding = CardPadding.MD;

	@Input()
	isFlipped = false;

	@HostBinding('class.a-rspd-card--front')
	get isFontDisplayed(): boolean {
		return !this.isFlipped;
	}

	@HostBinding('class.a-rspd-card--back')
	get isBackDisplayed(): boolean {
		return this.isFlipped;
	}

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
