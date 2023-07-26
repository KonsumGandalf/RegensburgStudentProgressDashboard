import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RspdCardComponent, RspdIconComponent } from '@rspd/shared/frontend/ui/atoms';

@NgModule({
	imports: [CommonModule, RspdIconComponent, RspdCardComponent],
	declarations: [],
	exports: [],
})
export class RspdSubmissionOverview {}
