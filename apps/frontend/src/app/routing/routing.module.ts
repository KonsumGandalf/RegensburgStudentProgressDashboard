import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { APP_ROUTES } from './app.routes';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forRoot(APP_ROUTES, {
			bindToComponentInputs: true,
		}),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
