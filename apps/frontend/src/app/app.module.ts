import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RspdEnvironmentModule } from '@rspd/shared/frontend/environment';
import {
	RspdSubmissionOverview
} from '@rspd/student-submissions/frontend/submission-overview';
import { TokenInterceptorService } from '@rspd/user/frontend/auth';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './routing/routing.module';
import { AppTranslationModule } from './translation/translation.module';

@NgModule({
	imports: [
		BrowserModule,
		HttpClientModule,

		AppRoutingModule,
		RouterModule,
		AppTranslationModule,

		RspdEnvironmentModule.forRoot(environment),
	],
	declarations: [AppComponent],
	bootstrap: [AppComponent],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptorService,
			multi: true,
		},
	],
})
export class AppModule {}
