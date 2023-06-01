import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { RspdCardComponent } from '@rspd/shared/frontend/ui/atoms';

@Component({
	selector: 'm-rspd-assignment-overview',
	standalone: true,
	imports: [CommonModule, RspdCardComponent],
	templateUrl: './assignment-overview.component.html',
	styleUrls: ['./assignment-overview.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'm-rspd-assignment-overview',
	},
})
export class RspdAssignmentOverviewComponent {
}
