import { Routes } from '@angular/router';

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
			{
				path: '',
				loadChildren: () =>
					import('@rspd/student-submissions/frontend/shell').then((m) => m.RspdStudentSubmissionsShellModule),
			},
		],
	},
];

export const ROUTES_AS_NAV_BAR_ITEMS = [
	{ label: 'NAVIGATION.LINKS.HOME', routerLink: '/', active: false },
	{ label: 'NAVIGATION.LINKS.OVERVIEW', routerLink: '/overview', active: false },
	{ label: 'NAVIGATION.LINKS.CERTIFICATE', routerLink: '/certificate', active: false },
]
