import { Injectable, signal } from '@angular/core';
import { IResponseAuthentication } from '@rspd/user/common/models';

import { AuthUser } from '../models/auth-user';
import { UnconfirmedMailError } from '../models/errors/unconfirmed-mail.error';

@Injectable({ providedIn: 'root' })
export class AuthService {
	user = signal('');

	handleAuthentication(response: IResponseAuthentication) {
		if (response.isEmailValidated === false) {
			throw new UnconfirmedMailError();
		}

		const user = new AuthUser(response.access_token, response.tokenExpirationDate);
		this.user.next(user);
	}

	handleAuthentication
}
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { LoginCredentials, User } from './user.model';
import {
	catchError,
	Observable,
	Subject,
	throwError,
	tap,
	BehaviorSubject,
} from 'rxjs';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.action';

export interface AuthResponse {
	kind: string;
	idToken: string;
	email: string;
	refreshToken: string;
	expiresIn: string;
	localId: string;
	registered?: boolean;
}

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	registerLink =
		'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
	loginLink =
		'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
// @ts-ignore
	user = new BehaviorSubject<User>(null);
	tokenExpirationTimer: any;
	apiKey = environment.fireBaseApiKey;

	constructor(
		private http: HttpClient,
		/*private router: Router,*/
		private store: Store<fromApp.AppState>
	) {
	}

	setLogoutTimer(expirationDuration: number) {
		this.tokenExpirationTimer = setTimeout(() => {
			this.store.dispatch(new AuthActions.Logout());
		}, expirationDuration);
	}

	clearLogoutTimer() {
		if (this.tokenExpirationTimer) {
			clearTimeout(this.tokenExpirationTimer);
			this.tokenExpirationTimer = null;
		}
	}

	autoLogout(expirationDuration: number) {
		this.tokenExpirationTimer = setTimeout(() => {
			this.logout();
		}, expirationDuration);
	}

	autoLogin() {
		const userString = localStorage.getItem('userData');
		if (userString == null) {
			return;

		}

	const userData: {
		email: string;
		id: string;
		_token: string;
		_tokenExpirationDate: string;
	} = JSON.parse(userString);
	const loadedUser = new User(
		userData.email,
		userData.id,
		userData._token,
		new Date(userData._tokenExpirationDate)
	);

	}

	handleAuthentication(response: IResponseAuthentication) {
		const user = new AuthUser(response.access_token, response.tokenExpirationDate);
		this.user.next(user);
	}

	calculateTimeFunction() {
		new Date(userData._tokenExpirationDate).getTime() -
		new Date().getTime();
		this.autoLogout(expiresIn);
	}

	logout() {
		this.store.dispatch(new AuthActions.Logout());
		localStorage.removeItem('userData');
		if (this.tokenExpirationTimer) {
			clearTimeout(this.tokenExpirationTimer);
		}
		this.tokenExpirationTimer = null;
	}*/
}


}
}*/

/*
}*/

/*logout() {
// this.user.next(null);
this.store.dispatch(new AuthActions.Logout());
// this.router.navigate(['/auth']);
localStorage.removeItem('userData');
if (this.tokenExpirationTimer) {
clearTimeout(this.tokenExpirationTimer);
}
this.tokenExpirationTimer = null;
}*/

/*private handleAuth(resData: AuthResponse) {
const { email, localId: userId, idToken: token, expiresIn } = resData;
const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
const user = new User(email, userId, token, expirationDate);
// this.user.next(user);
this.store.dispatch(
new AuthActions.AuthenticateSuccess({
email: email,
id: userId,
token: token,
expirationDate: expirationDate,
})
);
this.autoLogout(+expiresIn * 1000);
localStorage.setItem('userData', JSON.stringify(user));
}*/

