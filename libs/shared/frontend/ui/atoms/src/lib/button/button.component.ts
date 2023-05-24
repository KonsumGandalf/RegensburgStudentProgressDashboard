import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
	selector: 'rspd-button',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss'],
})
/**
 * Test Button Component
 */
export class ButtonComponent {
	/**
	 * Test input lol
	 */
	@Input()
	public testInput?: string;
}
