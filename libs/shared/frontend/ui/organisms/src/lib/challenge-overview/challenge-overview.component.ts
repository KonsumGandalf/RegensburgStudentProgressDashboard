import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'o-rspd-challenge-overview',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './challenge-overview.component.html',
	styleUrls: ['./challenge-overview.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChallengeOverviewComponent {}
