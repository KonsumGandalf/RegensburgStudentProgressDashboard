import { Route } from '@angular/router';
import { authGuard } from '@rspd/user/frontend/auth';
import {
	RspdLoginComponent,
	RspdProfileComponent,
	RspdRegisterComponent,
} from '@rspd/user/frontend/identity-management';

import { RspdUserPage } from './page/user.page';

/**
 * The shell routes inside the domain user
 */
export const SHELL_ROUTES: Route[] = [
	{
		path: '',
		component: RspdUserPage,
		children: [
			{
				path: 'register',
				component: RspdRegisterComponent,
			},
			{
				path: 'login',
				component: RspdLoginComponent,
			},
			{
				path: 'profile',
				component: RspdProfileComponent,
				canActivate: [authGuard]
			},
		],
	},
];
