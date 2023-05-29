import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
	ButtonAppearance,
	IconSize,
	IconUnion,
	OthLogos,
	PhosphorIcons,
} from '@rspd/shared/frontend/ui/atoms';
import { IUserIntermediate } from '@rspd/user/common/models';
import { RegisterUserFacade } from '@rspd/user/frontend/domain';
import { forkJoin, interval } from 'rxjs';

import { formInformation } from '../../models/form-information';
import { ICardInformation } from '../../models/interfaces/card-information.interface';
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

	formInformation = formInformation;
	othLogo = OthLogos.OTH;
	buttonAppearance = ButtonAppearance.SHIFTED;
	minPasswordLength = 8;
	cardInformation: ICardInformation = {
		iconLogo: OthLogos.OTH,
		isLoading: false,
		iconSize: '100%',
	};

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
		this.cardInformation = {
			isLoading: true,
			iconLogo: PhosphorIcons.EMAIL,
			iconSize: IconSize.LG,
		};
		forkJoin(
			interval(5000),
			this._registerUserFacade.registerUser(this.registerForm.value as IUserIntermediate),
		).subscribe(
			() => {
				this._router.navigate(['/login']);
			},
			(error) => {
				console.log(error);
			},
		);
	}
}
