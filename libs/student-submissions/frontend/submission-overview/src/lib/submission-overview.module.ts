import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
	RspdIconComponent
} from '@rspd/shared/frontend/ui/atoms';

import { RspdChallengeOverviewComponent } from './components/challenges-overview/challenge-overview.component';


@NgModule({
	imports: [
		CommonModule,
		RspdIconComponent,
	],
	declarations: [RspdChallengeOverviewComponent],
	exports: [],
})
export class RspdSubmissionOverview {}
