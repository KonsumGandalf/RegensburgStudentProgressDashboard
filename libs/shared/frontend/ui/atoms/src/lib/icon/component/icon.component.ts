import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	HostBinding,
	Input,
	ViewEncapsulation,
} from '@angular/core';

import { IconColor } from '../models/icon-color';
import { IconSize } from '../models/icon-size';
import { OthLogos } from '../models/oth-logos';
import { PhosphorIcons } from '../models/phosphor-icons';
import { TopicIcons } from '../models/topic-icons';

@Component({
	selector: 'a-rspd-icon',
	standalone: true,
	imports: [],
	templateUrl: './icon.component.html',
	styleUrls: ['./icon.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'a-rspd-icon i',
	},
})
export class RspdIconComponent {
	constructor(private _element: ElementRef) {}

	/**
	 * The size of the icon. The default value is IconSize.md which is equal to 2rem.
	 * @type {IconSize}
	 */
	@Input()
	@HostBinding('style.--size')
	size?: IconSize | string = IconSize.MD;

	/**
	 * The color of the icon. By default, it is black.
	 * @type {IconSize}
	 */
	@Input()
	color?: IconColor = IconColor.BLACK;

	@HostBinding('class')
	get isColored(): string {
		return `a-rspd-icon--${this.color || IconColor.BLACK}`;
	}

	/**
	 * Sets the appearance of the icon.
	 * @param {TopicIcons} iconName - The name of the icon appearance.
	 */
	@Input()
	set appearance(iconName: PhosphorIcons | TopicIcons | OthLogos) {
		this._element.nativeElement.innerHTML = iconName || PhosphorIcons.CORRECT;
	}
}
