import { Injectable } from '@angular/core';
import { IResponseAuthentication } from '@rspd/user/common/models';
import { BehaviorSubject } from 'rxjs';

import { AuthUser } from '../models/auth-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
	user = new BehaviorSubject<AuthUser>({} as AuthUser);

	handleAuthentication(response: IResponseAuthentication) {
		const user = new AuthUser(response.access_token, response.tokenExpirationDate);
		this.user.next(user);
	}
}
