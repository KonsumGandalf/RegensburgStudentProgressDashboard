import { Routes } from '@angular/router';
import { path } from '@angular-devkit/core';

import { AppRootLayout } from '../layouts/root.layout';

export const APP_ROUTES: Routes = [
	{
		path: '',
		component: AppRootLayout,
		children: [
			{
				path: '',
				loadChildren: () =>
					import('@rspd/user/frontend/shell').then((m) => m.RspdUserShellModule),
			},
		],
	},
];
