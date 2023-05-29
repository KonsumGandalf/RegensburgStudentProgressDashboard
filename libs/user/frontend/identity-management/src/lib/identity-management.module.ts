import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RspdButtonComponent, RspdInputComponent } from '@rspd/shared/frontend/ui/atoms';
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

		RspdInputComponent,
		RspdVerificationComponent,
		RspdButtonComponent,
	],
	declarations: [RspdRegisterComponent, RspdLoginComponent, RspdProfileComponent],
	exports: [RspdRegisterComponent],
})
export class RspdIdentityModule {}
