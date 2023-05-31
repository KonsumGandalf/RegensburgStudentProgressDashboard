import { Injectable } from '@angular/core';
import { ILoginUser, IResponseAuthentication } from '@rspd/user/common/models';
import { Observable } from 'rxjs';

import { UserRepository } from '../../infrastructure/user.repository';
import { GeneralUserFacade } from './general-user.facade';

/**
 * Facade for the user domain in the context of login
 */
@Injectable({ providedIn: 'root' })
export class LoginUserFacade extends GeneralUserFacade {
	constructor(private readonly _userRepository: UserRepository) {
		super(_userRepository);
	}

	loginUser(loginUser: ILoginUser): Observable<IResponseAuthentication> {
		return this._userRepository.loginUser(loginUser);
	}
}
