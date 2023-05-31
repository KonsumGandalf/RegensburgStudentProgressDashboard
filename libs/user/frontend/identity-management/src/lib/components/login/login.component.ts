import { animate, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	signal,
	ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonAppearance, OthLogos } from '@rspd/shared/frontend/ui/atoms';
import { ILoginUser } from '@rspd/user/common/models';
import { UnconfirmedMailError } from '@rspd/user/frontend/auth';
import { LoginUserFacade } from '@rspd/user/frontend/domain';
import { catchError, Observable, throwError } from 'rxjs';

import { formInformation } from '../../models/form-information';
import { ICardInformation } from '../../models/interfaces/card-information.interface';

@Component({
	selector: 'o-rspd-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'o-rspd-login',
	},
	animations: [
		trigger('rotate', [
			transition('void => *', [
				style({ transform: 'rotateY(180deg)' }), // initial styles
				animate(
					'500ms',
					style({ transform: 'rotateY(0deg)' }), // final style after the transition has finished
				),
			]),
		]),
	],
})
export class RspdLoginComponent {
	constructor(
		private readonly _loginUserFacade: LoginUserFacade,
		private readonly _router: Router,
	) {}

	formInformation = formInformation;
	cardInformation: ICardInformation = {
		iconLogo: OthLogos.OTH,
		isLoading: signal(false),
		iconSize: '100%',
	};
	buttonAppearance = ButtonAppearance.SHIFTED;

	loginForm: FormGroup = new FormGroup({
		username: new FormControl(undefined, [Validators.required]),
		password: new FormControl(undefined, [Validators.required]),
	});

	getErrorMsg(property: string, error: string): string {
		return this.loginForm.get(property)?.getError(error);
	}

	@HostBinding('style.--progressBarVisible')
	get isVisible(): string {
		if (this.cardInformation.isLoading()) {
			return 'visible';
		}
		return 'hidden';
	}

	onSubmit() {
		if (!this.loginForm.valid) {
			return;
		}

		this.cardInformation.isLoading.set(true);

		this._loginUserFacade
			.loginUser(this.loginForm.value as ILoginUser)
			.pipe(
				catchError((error: unknown): Observable<any> => {
					if (error instanceof UnconfirmedMailError) {
						return throwError(
							() => 'USER.IDENTITY_MANAGEMENT.AUTH.RESPONSE.UNCONFIRMED_EMAIL',
						);
					} else if (error instanceof HttpErrorResponse) {
						if (error.status === 401) {
							return throwError(
								() => 'USER.IDENTITY_MANAGEMENT.AUTH.RESPONSE.INVALID_LOGIN',
							);
						}
					}

					return throwError(() => 'USER.IDENTITY_MANAGEMENT.AUTH.RESPONSE.UNKNOWN_ERROR');
				}),
			)
			.subscribe(
				(resData) => {
					this._router.navigate(['/profile']);
				},
				(error) => {
					this.loginForm.controls['username'].setErrors({
						incorrect: error,
					});
					this.loginForm.controls['password'].setErrors({
						incorrect: error,
					});

					this.cardInformation.isLoading.set(false);
				},
			);
	}
}
