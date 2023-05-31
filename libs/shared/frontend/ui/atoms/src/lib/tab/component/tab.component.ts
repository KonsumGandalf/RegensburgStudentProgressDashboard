import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	HostBinding,
	Input,
	Output,
	ViewEncapsulation
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbNavLink } from '@ng-bootstrap/ng-bootstrap';

import { INavBarItem } from '../models/nav-bar.interface';

/**
 * Represents a tab component in the application.
 */
@Component({
	selector: 'a-rspd-tab, a[src], a[navBar]',
	standalone: true,
	imports: [NgbNavLink, RouterLink],
	templateUrl: './tab.component.html',
	styleUrls: ['./tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'a-rspd-tab',
	},
})
export class RspdTabComponent {
	@Input() navBar?: INavBarItem;
	@Output() tabSelected: EventEmitter<void> = new EventEmitter<void>();

	selectTab(): void {
		this.tabSelected.emit();
	}

	/**
	 * Sets the active scss class in case the navBar is active
	 */
	@HostBinding('class.a-rspd-tab--active')
	get isActive(): boolean {
		if(!this.navBar) {
			return false;
		}
		return this.navBar.active;
	}
}
