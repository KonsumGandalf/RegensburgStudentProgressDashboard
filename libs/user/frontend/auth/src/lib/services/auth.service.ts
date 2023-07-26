import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { IResponseAuthentication } from '@rspd/user/common/models';

import { AuthUser } from '../models/auth-user';
import { UnconfirmedMailError } from '../models/errors/unconfirmed-mail.error';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	user: WritableSignal<undefined | AuthUser> = signal(undefined);
	tokenExpirationTimer?: number;

	constructor(private http: HttpClient, private router: Router) {}

	public handleAuthentication(response: IResponseAuthentication, username: string) {

		if (response.isValidated.email === false) {
			throw new UnconfirmedMailError();
		}
		const user = new AuthUser(
			response.access_token,
			response.tokenExpirationDate,
			response.isValidated.github,
			username,
		);

		this.user.set(user);
		localStorage.setItem('userData', JSON.stringify(user));
		this.autoLogout(this.calculateExpirationTime(response.tokenExpirationDate) * 1000);
	}

	private calculateExpirationTime(expirationDate: Date): number {
		try {
			const a = expirationDate.getTime() - new Date().getTime();
			return a
		} finally {
			// eslint-disable-next-line no-unsafe-finally
			return 5000;
		}
	}

	public autoLogin() {
		const userData = localStorage.getItem('userData');
		console.log(userData)
		if (!userData) {
			return;
		}

		const loadedData: {
			_access_token: string;
			_tokenExpirationDate: string;
			isGithubValidated: boolean
			username: string;
		} = JSON.parse(userData);

		const loadedUser = new AuthUser(
			loadedData._access_token,
			new Date(loadedData._tokenExpirationDate),
			loadedData.isGithubValidated,
			loadedData.username,
		);
		this.user.set(loadedUser);
		console.log(loadedData)
		this.autoLogout(this.calculateExpirationTime(loadedUser._tokenExpirationDate));
	}

	logout() {
		this.user.set(undefined);
		this.router.navigate(['/login']);
		localStorage.removeItem('userData');
		if (this.tokenExpirationTimer) {
			clearTimeout(this.tokenExpirationTimer);
		}
		this.tokenExpirationTimer = undefined;
	}

	private autoLogout(expirationDuration: number) {
		setTimeout(() => {
			this.logout();
		}, expirationDuration);
	}
}
