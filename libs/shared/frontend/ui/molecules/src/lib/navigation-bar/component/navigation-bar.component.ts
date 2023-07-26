import { NgForOf, NgIf } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter, HostBinding,
	Input, OnInit,
	Output,
	Signal,
	ViewEncapsulation,
	WritableSignal
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
	CardAppearance,
	CardPadding,
	RspdButtonComponent,
	RspdCardComponent,
} from '@rspd/shared/frontend/ui/atoms';
import { RspdTabComponent } from '@rspd/shared/frontend/ui/atoms';

import { INavBarItem } from '../models/nav-bar.interface';
import { NOT_AUTHENTICATED_NAV_BAR_ITEMS } from '../models/not-authenticated-nav-bar-items';

/**
 * Component which displays the navigation bar of the frontend app
 */
@Component({
	selector: 'm-rspd-nav-bar',
	standalone: true,
	imports: [
		NgbNavModule,
		NgbDropdownModule,
		RspdButtonComponent,
		RouterLink,
		RouterOutlet,
		NgForOf,
		RspdCardComponent,
		RspdTabComponent,
		MatTabsModule,
		NgIf,
		TranslateModule,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	templateUrl: './navigation-bar.component.html',
	styleUrls: ['./navigation-bar.component.scss'],
	host: {
		class: 'm-rspd-nav-bar',
	},
})
export class RspdNavigationBarComponent implements OnInit{
	@Input()
	username!: Signal<string | undefined>;

	@Input({ required: true })
	currentRoute!: Signal<string>;

	@Input({ required: true })
	navBarItems!: WritableSignal<INavBarItem[]>;

	@Output()
	logoutTriggered: EventEmitter<void> = new EventEmitter<void>();

	notAuthenticatedNavBarItems: INavBarItem[] = NOT_AUTHENTICATED_NAV_BAR_ITEMS;

	cardInformation = {
		appearance: CardAppearance.OUTLINED,
		padding: CardPadding.NONE,
	};

	/**
	 * Sets the active navigation item based on the current route.
	 */
	setActiveNavItemByUrl(): void {
		if (this.username()) {
			this.navBarItems.update((content) => {
				return content.map((item) => {
					item.active = this.currentRoute() == item.routerLink;
					return item;
				});
			});
		} else {
			this.notAuthenticatedNavBarItems.map((item) => {
				item.active = this.currentRoute() == item.routerLink;
				return item;
			});
		}
	}

	@HostBinding('class.logged-in')
	get isLoggedIn(): boolean {
		return this.username() != undefined;
	}

	@HostBinding('class.not-logged-in')
	get isNotLoggedIn(): boolean {
		return this.username() == undefined;
	}

	ngOnInit(): void {
		this.setActiveNavItemByUrl()
	}
}
