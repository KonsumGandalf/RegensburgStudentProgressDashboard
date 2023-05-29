import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT, IEnvironment } from '@rspd/shared/frontend/environment';
import {
	ICheckAvailability,
	ILoginUser,
	IResponseAuthentication,
	IUserIntermediate,
} from '@rspd/user/common/models';
import { AuthService } from '@rspd/user/frontend/auth';
import { map, Observable, tap } from 'rxjs';

/**
 * Repository service to communicate with the backend
 */
@Injectable({ providedIn: 'root' })
export class UserRepository {
	private readonly _authRoute: string;

	constructor(
		private readonly _httpClient: HttpClient,
		private readonly _authService: AuthService,
		@Inject(ENVIRONMENT) readonly _environment: IEnvironment,
	) {
		this._authRoute = `${this._environment.apiUrl}/auth`;
	}

	checkTakenSource(subRoute: string, checkAvailability: ICheckAvailability): Observable<boolean> {
		let httpParams = new HttpParams();
		if (checkAvailability.username) {
			httpParams = httpParams.append('username', checkAvailability.username);
		}
		if (checkAvailability.email) {
			httpParams = httpParams.append('email', checkAvailability.email);
		}
		if (checkAvailability.confirmedMail) {
			httpParams = httpParams.append('confirmedMail', checkAvailability.confirmedMail);
		}

		const url = `${this._authRoute}/${subRoute}`;

		return this._httpClient
			.get<boolean>(url, { params: httpParams })
			.pipe(map((response: boolean | undefined) => !!response));
	}

	registerUser(registerUser: IUserIntermediate): Observable<void> {
		return this._httpClient.post<void>(`${this._authRoute}/register`, registerUser);
	}

	loginUser(loginUser: ILoginUser): Observable<IResponseAuthentication> {
		return this._httpClient
			.post<IResponseAuthentication>(`${this._authRoute}/login`, loginUser)
			.pipe(
				tap((resData) => {
					this._authService.handleAuthentication(resData);
				}),
			);
	}

	requestUserInformation(): Observable<IUserIntermediate> {
		return this._httpClient.get<IUserIntermediate>(`${this._authRoute}`);
	}
}
