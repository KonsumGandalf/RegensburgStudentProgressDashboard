import { ICheckAvailability } from '@rspd/user/common/models';
import { Observable } from 'rxjs';

import { UserRepository } from '../../infrastructure/user.repository';

/**
 * Abstract facade which is the base for the other user related facades
 */
export abstract class GeneralUserFacade {
	protected constructor(private readonly _repository: UserRepository) {}
	checkUsernameIsTaken(username: string): Observable<boolean> {
		return this._repository.checkTakenSource('check', {
			username: username,
		} as ICheckAvailability);
	}
}
