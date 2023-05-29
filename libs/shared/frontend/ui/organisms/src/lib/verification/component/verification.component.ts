import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	Input,
	ViewEncapsulation,
} from '@angular/core';
import {
	IconUnion,
	RspdButtonComponent,
	RspdCardComponent,
	RspdLoadingIndicatorComponent,
} from '@rspd/shared/frontend/ui/atoms';

/**
 * Component to display profile verification related data like Login
 */
@Component({
	selector: 'o-rspd-verification',
	standalone: true,
	imports: [CommonModule, RspdCardComponent, RspdButtonComponent, RspdLoadingIndicatorComponent],
	templateUrl: './verification.component.html',
	styleUrls: ['./verification.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'o-rspd-verification',
	},
})
export class RspdVerificationComponent {
	@Input()
	isLoading = false;

	@HostBinding('style.--progressBarVisible')
	get isVisible(): string {
		if (this.isLoading) {
			return 'visible';
		}
		return 'hidden';
	}

	@Input()
	headerLogo?: IconUnion;

	@Input()
	title?: string;
}
