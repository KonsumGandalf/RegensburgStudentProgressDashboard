import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TextFieldType } from '../models/text-field';

/**
 * Component representing an input field its label.
 */
@Component({
	selector: 'a-rspd-input',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
	host: {
		class: 'a-rspd-input',
	},
})
export class RspdInputComponent {
	/**
	 * The label for the input field.
	 */
	@Input()
	label?: string;

	/**
	 * The maximum length allowed for the input value.
	 */
	@Input()
	maxLength?: number = 15;

	/**
	 * The minimum length required for the input value.
	 */
	@Input()
	minLength?: number = 3;

	/**
	 * Additional supporting text for the input field.
	 */
	@Input()
	supportingText?: string;

	/**
	 * The pattern or type of the input field.
	 */
	@Input()
	pattern?: TextFieldType;
}
