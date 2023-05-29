import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/**
 * Page which displays organisms related to the user domain like login
 */
@Component({
	selector: 'p-rspd-user',
	templateUrl: './user.page.html',
	styleUrls: ['./user.page.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'p-rspd-user',
	},
})
export class RspdUserPage {}
