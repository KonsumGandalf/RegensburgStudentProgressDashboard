import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { OthLogos, PhosphorIcons } from '@rspd/shared/frontend/ui/atoms';

@Component({
	selector: 'o-rspd-connect-github',
	templateUrl: './connect-github.component.html',
	styleUrls: ['./connect-github.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'o-rspd-connect-github',
	},
})
export class RspdConnectGithubComponent {
	githubIcon = PhosphorIcons.GITHUB;
	iconLogo = OthLogos.OTH;
}
