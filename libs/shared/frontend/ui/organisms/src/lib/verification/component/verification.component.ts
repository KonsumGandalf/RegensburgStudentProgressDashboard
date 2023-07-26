import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
	CardPadding,
	IconUnion,
	RspdButtonComponent,
	RspdCardComponent,
	RspdIconComponent,
	RspdLoadingIndicatorComponent
} from '@rspd/shared/frontend/ui/atoms';

/**
 * Component to display profile verification related data like Login
 */
@Component({
	selector: 'o-rspd-verification',
	standalone: true,
	imports: [
		CommonModule,
		RspdCardComponent,
		RspdButtonComponent,
		RspdLoadingIndicatorComponent,
		RspdIconComponent,
		TranslateModule,
	],
	templateUrl: './verification.component.html',
	styleUrls: ['./verification.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'o-rspd-verification',
	},
})
export class RspdVerificationComponent {
	padding: CardPadding.MD;

	@Input()
	isLoading = false;

	@Input()
	headerLogo?: IconUnion;

	@Input()
	size = '100%';

	@Input()
	title?: string;
}
