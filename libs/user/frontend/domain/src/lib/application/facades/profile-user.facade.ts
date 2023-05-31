import { Injectable } from '@angular/core';
import { IResponseAuthentication, IUserIntermediate } from '@rspd/user/common/models';
import { Observable } from 'rxjs';

import { UserRepository } from '../../infrastructure/user.repository';
import { GeneralUserFacade } from './general-user.facade';

/**
 * Facade for the user domain in the context of profile
 */
@Injectable({ providedIn: 'root' })
export class ProfileUserFacade extends GeneralUserFacade {
	constructor(private readonly _userRepository: UserRepository) {
		super(_userRepository);
	}

	requestUserInformation(): Observable<IUserIntermediate> {
		return this._userRepository.requestUserInformation();
	}

	updateUser(updateUser: IUserIntermediate): Observable<IResponseAuthentication> {
		return this._userRepository.updateUser(updateUser);
	}
}
