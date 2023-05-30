import {
	ChangeDetectionStrategy,
	Component,
	Signal,
	signal,
	ViewEncapsulation,
	WritableSignal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonAppearance, OthLogos } from '@rspd/shared/frontend/ui/atoms';
import { IUserIntermediate } from '@rspd/user/common/models';
import { ProfileUserFacade } from '@rspd/user/frontend/domain';
import { BehaviorSubject, forkJoin, interval, Observable } from 'rxjs';

import { formInformation } from '../../models/form-information';
import { AuthInputValidator } from '../../models/validators/auth-input.validator';

@Component({
	selector: 'o-rspd-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'o-rspd-profile',
	},
})
export class RspdProfileComponent {
	initialUsername = signal('wrong');

	constructor(private readonly _profileUserFacade: ProfileUserFacade) {
		this.profileForm = new FormGroup({
			email: new FormControl(),
			firstName: new FormControl(null, [Validators.required]),
			lastName: new FormControl(null, [Validators.required]),
			username: new FormControl(
				null,
				[Validators.required],
				[
					AuthInputValidator.validateUsernameIsTaken(
						this._profileUserFacade,
						this.initialUsername,
					),
				],
			),
			password: new FormControl(undefined, [
				AuthInputValidator.validPassword(this.minPasswordLength),
			]),
			confirmPassword: new FormControl(undefined, [
				Validators.required,
				AuthInputValidator.validFieldMatch('password'),
			]),
		});

		this._profileUserFacade.requestUserInformation().subscribe((data) => {
			this.profileForm.get('email')?.setValue(data.email);
			this.profileForm.get('firstName')?.setValue(data.firstName);
			this.profileForm.get('lastName')?.setValue(data.lastName);
			this.profileForm.get('username')?.setValue(data.username);
			this.initialUsername.set(data.username);

			console.log(this.initialUsername());
		});
	}

	formInformation = formInformation;
	othLogo = OthLogos.OTH;
	buttonAppearance = ButtonAppearance.SHIFTED;
	minPasswordLength = 8;

	isLoading = false;
	profileForm: FormGroup;

	getErrorMsg(property: string, error: string): string {
		return this.profileForm.get(property)?.getError(error);
	}

	onSubmit() {
		if (!this.profileForm.valid) {
			return;
		}

		this._profileUserFacade.updateUser(this.profileForm.value as IUserIntermediate).subscribe(
			() => {
				console.log('functioned');
			},
			(error) => {
				this.profileForm.controls['username'].setErrors({
					incorrect: 'USER.IDENTITY_MANAGEMENT.AUTH.RESPONSE.UNKNOWN_ERROR',
				});
				console.log(error);
			},
		);
	}
}
