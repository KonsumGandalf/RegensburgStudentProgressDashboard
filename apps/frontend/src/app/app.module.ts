import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RspdEnvironmentModule } from '@rspd/shared/frontend/environment';

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
})
export class AppModule {}
