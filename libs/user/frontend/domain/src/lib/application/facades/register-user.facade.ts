import { Injectable } from '@angular/core';
import {
	ICheckAvailability,
	IResponseAuthentication,
	IUserIntermediate,
} from '@rspd/user/common/models';
import { Observable } from 'rxjs';

import { UserRepository } from '../../infrastructure/user.repository';
import { GeneralUserFacade } from './general-user.facade';

/**
 * Facade for the user domain in the context of registration
 */
@Injectable({ providedIn: 'root' })
export class RegisterUserFacade extends GeneralUserFacade {
	constructor(private readonly _userRepository: UserRepository) {
		super(_userRepository);
	}

	checkEmailIsTaken(email: string): Observable<boolean> {
		return this._userRepository.checkTakenSource('check', {
			email: email,
		} as ICheckAvailability);
	}

	registerUser(registerUser: IUserIntermediate): Observable<void> {
		return this._userRepository.registerUser(registerUser);
	}
}
