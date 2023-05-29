import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonAppearance, OthLogos } from '@rspd/shared/frontend/ui/atoms';
import { ILoginUser } from '@rspd/user/common/models';
import { LoginUserFacade } from '@rspd/user/frontend/domain';

import { formInformation } from '../../models/form-information';

@Component({
	selector: 'o-rspd-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'o-rspd-login',
	},
})
export class RspdLoginComponent {
	constructor(
		private readonly _loginUserFacade: LoginUserFacade,
		private readonly _router: Router,
	) {}

	isLoading = false;

	formInformation = formInformation;
	othLogo = OthLogos.OTH;
	buttonAppearance = ButtonAppearance.SHIFTED;

	loginForm: FormGroup = new FormGroup({
		username: new FormControl(undefined, [Validators.required]),
		password: new FormControl(undefined, [Validators.required]),
	});

	getErrorMsg(property: string, error: string): string {
		return this.loginForm.get(property)?.getError(error);
	}

	onSubmit() {
		if (!this.loginForm.valid) {
			return;
		}

		this.isLoading = true;
		this._loginUserFacade.loginUser(this.loginForm.value as ILoginUser).subscribe(
			(resData) => {
				this._router.navigate(['/profile']);
			},
			(error) => {
				console.log(error);
				this.loginForm.controls['username'].setErrors({
					incorrect: 'USER.IDENTITY_MANAGEMENT.AUTH.RESPONSE.INVALID_LOGIN',
				});
				this.loginForm.controls['password'].setErrors({
					incorrect: 'USER.IDENTITY_MANAGEMENT.AUTH.RESPONSE.INVALID_LOGIN',
				});
			},
		);
		this.isLoading = false;
	}
}
