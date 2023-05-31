import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
	RspdButtonComponent,
	RspdInputComponent,
	RspdLoadingIndicatorComponent,
} from '@rspd/shared/frontend/ui/atoms';
import { RspdVerificationComponent } from '@rspd/shared/frontend/ui/organisms';

import {
	RspdLoginComponent,
	RspdProfileComponent,
	RspdRegisterComponent,
} from './components/public-api';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		TranslateModule,
		RouterLink,

		RspdInputComponent,
		RspdVerificationComponent,
		RspdButtonComponent,
		RspdLoadingIndicatorComponent,
	],
	declarations: [RspdRegisterComponent, RspdLoginComponent, RspdProfileComponent],
	exports: [RspdRegisterComponent],
})
export class RspdIdentityModule {}
