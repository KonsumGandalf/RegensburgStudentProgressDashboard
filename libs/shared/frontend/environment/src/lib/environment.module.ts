import { ModuleWithProviders, NgModule } from '@angular/core';

import { ENVIRONMENT } from './environment.class';
import { IEnvironment } from './environment.interface';

@NgModule()
export class RspdEnvironmentModule {
	static forRoot(environment: IEnvironment): ModuleWithProviders<RspdEnvironmentModule> {
		return {
			ngModule: RspdEnvironmentModule,
			providers: [{ provide: ENVIRONMENT, useValue: environment }],
		};
	}
}
