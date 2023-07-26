import '@material/web/linearprogress/linear-progress.js';

import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ViewEncapsulation,
} from '@angular/core';

/**
 * Component representing a loading indicator.
 */
@Component({
	selector: 'a-rspd-loading-indicator',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './loading-indicator.component.html',
	styleUrls: ['./loading-indicator.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'a-rspd-loading-indicator',
	},
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RspdLoadingIndicatorComponent {}
