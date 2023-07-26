import { Route } from '@angular/router';

import { RspdSubmissionsOverviewPage } from './pages/overview/submissions-overview.page';

/**
 * The shell routes inside the domain student-submissions
 */
export const SHELL_ROUTES: Route[] = [
	{
		path: 'overview',
		component: RspdSubmissionsOverviewPage,
		children: [
		],
	},
];
