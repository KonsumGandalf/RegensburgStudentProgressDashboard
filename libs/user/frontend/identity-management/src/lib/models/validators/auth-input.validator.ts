import { signal, WritableSignal } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { allowedDomains } from '@rspd/user/common/models';
import { GeneralUserFacade, RegisterUserFacade } from '@rspd/user/frontend/domain';
import { map, Observable, of } from 'rxjs';

import { CONSTANTS } from '../auth-constants';

export class AuthInputValidator {
	static validateUsernameIsTaken(
		registerUserFacade: GeneralUserFacade,
		currentName: WritableSignal<string> = signal(''),
	): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			console.log(control.value, currentName());
			if (control.value === currentName()) {
				return of(null);
			}
			return registerUserFacade.checkUsernameIsTaken(control.value).pipe(
				map((result: boolean) => {
					return result === true
						? { usernameAlreadyExists: 'The Username is already used' }
						: null;
				}),
			);
		};
	}

	static validateEmailIsTaken(registerUserFacade: RegisterUserFacade): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			return registerUserFacade.checkEmailIsTaken(control.value).pipe(
				map((result: boolean) => {
					return result === true
						? { emailAlreadyUsed: 'The Email Address is already used' }
						: null;
				}),
			);
		};
	}

	static validateEmailDomain(control: AbstractControl): ValidationErrors | null {
		const email = control.value;

		if (email) {
			for (const domain of allowedDomains) {
				if (email.includes(domain.toLowerCase())) {
					return null;
				}
			}
		}

		return { invalidDomain: true };
	}

	static validPassword(minPasswordLength = 8): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!control.value) {
				return { invalidPassword: `Password is required.` };
			}
			if (control.value.length < minPasswordLength) {
				return { invalidPassword: `Password is too short.` };
			}
			if (!CONSTANTS.SYMBOL_REGEX.test(control.value)) {
				return {
					invalidPassword: `Special character required`,
				};
			}
			if (!CONSTANTS.DIGIT_REGEX.test(control.value)) {
				return {
					invalidPassword: `Numeric character required`,
				};
			}
			if (!CONSTANTS.UPPERCASE_REGEX.test(control.value)) {
				return {
					invalidPassword: `Uppercase character required`,
				};
			}

			return null;
		};
	}

	static validFieldMatch(confirmControlName: string): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const parentControl = control.parent;
			const controlValue = control.value;
			if (parentControl) {
				const confirmControlValue = parentControl.get(confirmControlName)?.value;

				if (controlValue !== confirmControlValue) {
					return {
						fieldsMismatched: `Password fields do not match.`,
					};
				}
			}

			return null;
		};
	}
}
