import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
	IModuleTranslationOptions,
	ModuleTranslateLoader,
} from '@larscom/ngx-translate-module-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function moduleHttpLoaderFactory(http: HttpClient) {
	const baseTranslateUrl = './assets/i18n';

	const options: IModuleTranslationOptions = {
		modules: [
			{
				baseTranslateUrl,
				moduleName: 'app.information',
				pathTemplate: '{baseTranslateUrl}/app/information/{language}',
			},
			{
				baseTranslateUrl,
				moduleName: 'user.identity_management',
				pathTemplate: '{baseTranslateUrl}/user/identity-management/{language}',
			},
		],
	};

	return new ModuleTranslateLoader(http, options);
}

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,

		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: moduleHttpLoaderFactory,
				deps: [HttpClient],
			},
			defaultLanguage: 'de',
		}),
	],
	exports: [TranslateModule],
})
export class AppTranslationModule {}
