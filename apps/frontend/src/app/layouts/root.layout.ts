import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal,signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { RspdNavigationBarComponent } from '@rspd/shared/frontend/ui/molecules';
import { AuthService } from '@rspd/user/frontend/auth';

import { ROUTES_AS_NAV_BAR_ITEMS } from '../routing/app.routes';
import { AppTranslationModule } from '../translation/translation.module';

@Component({
	standalone: true,
	imports: [CommonModule, RouterModule, AppTranslationModule, RspdNavigationBarComponent],
	selector: 'rspd-root',
	templateUrl: './root.layout.html',
	styleUrls: ['./root.layout.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppRootLayout {
	navBarItems = signal(ROUTES_AS_NAV_BAR_ITEMS);
	username: Signal<string | undefined> = signal(undefined);
	currentRoute = signal('');
	
	constructor(private router: Router, protected authService: AuthService) {
		this.router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				this.currentRoute.set(event.urlAfterRedirects);
			}
		});
		this.username = computed(() => authService.user()?.username);
	}

	logout() {
		this.authService.logout();
	}
}
