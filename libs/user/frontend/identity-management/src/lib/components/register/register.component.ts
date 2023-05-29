import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonAppearance, OthLogos } from '@rspd/shared/frontend/ui/atoms';
import { IUserIntermediate } from '@rspd/user/common/models';
import { RegisterUserFacade } from '@rspd/user/frontend/domain';

import { formInformation } from '../../models/form-information';
import { AuthInputValidator } from '../../models/validators/auth-input.validator';

@Component({
	selector: 'o-rspd-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'o-rspd-register',
	},
})
export class RspdRegisterComponent {
	constructor(
		private readonly _registerUserFacade: RegisterUserFacade,
		private readonly _router: Router,
	) {}

	isLoading = false;
	formInformation = formInformation;
	othLogo = OthLogos.OTH;
	buttonAppearance = ButtonAppearance.SHIFTED;
	minPasswordLength = 8;

	registerForm: FormGroup = new FormGroup({
		email: new FormControl(
			undefined,
			[Validators.required, Validators.email, AuthInputValidator.validateEmailDomain],
			[AuthInputValidator.validateEmailIsTaken(this._registerUserFacade)],
		),
		firstName: new FormControl(undefined, [Validators.required]),
		lastName: new FormControl(undefined, [Validators.required]),
		username: new FormControl(
			undefined,
			[Validators.required],
			[AuthInputValidator.validateUsernameIsTaken(this._registerUserFacade)],
		),
		password: new FormControl(undefined, [
			AuthInputValidator.validPassword(this.minPasswordLength),
		]),
		confirmPassword: new FormControl(undefined, [
			Validators.required,
			AuthInputValidator.validFieldMatch('password'),
		]),
	});

	getErrorMsg(property: string, error: string): string {
		return this.registerForm.get(property)?.getError(error);
	}

	onSubmit() {
		if (!this.registerForm.valid) {
			return;
		}

		this.isLoading = true;
		this._registerUserFacade
			.registerUser(this.registerForm.value as IUserIntermediate)
			.subscribe(
				(resData) => {
					this._router.navigate(['/profile']);
				},
				(error) => {
					console.log(error);
				},
			);
		this.isLoading = false;
	}
}
