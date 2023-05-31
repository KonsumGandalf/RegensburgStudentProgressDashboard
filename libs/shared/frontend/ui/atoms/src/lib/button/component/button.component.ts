import { NgIf } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	Input,
	ViewEncapsulation,
} from '@angular/core';

import { RspdIconComponent } from '../../icon/component/icon.component';
import { IconColor } from '../../icon/models/icon-color';
import { IconSize } from '../../icon/models/icon-size';
import { PhosphorIcons } from '../../icon/models/phosphor-icons';
import { ButtonAppearance, ButtonAppearanceType } from '../models/button-appearance';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'a-rspd-button, button[appearance], a[appearance]',
	standalone: true,
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'a-rspd-button btn',
	},
	imports: [RspdIconComponent, NgIf],
})
export class RspdButtonComponent {
	protected _iconColor = IconColor.WHITE;
	protected _iconSize = IconSize.SM;

	/**
	 * Sets the appearance of the button. The default appearance is filled.
	 * @param {ButtonAppearance} appearance - The type of appearance.
	 */
	@Input()
	appearance?: ButtonAppearanceType = ButtonAppearance.FILLED;

	@HostBinding('class.a-rspd-button--filled')
	get isFilled(): boolean {
		return this.appearance === ButtonAppearance.FILLED;
	}

	@HostBinding('class.a-rspd-button--outlined')
	get isOutlined(): boolean {
		return this.appearance === ButtonAppearance.OUTLINED;
	}

	@HostBinding('class.a-rspd-button--shifted')
	get isShifted(): boolean {
		return this.appearance === ButtonAppearance.SHIFTED;
	}

	/**
	 * Adds an icon to the button component
	 * @param {PhosphorIcons} icon - The name of the icon.
	 */
	@Input()
	icon?: PhosphorIcons;
}
