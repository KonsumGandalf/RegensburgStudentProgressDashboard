import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, Observable, take } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { AuthUser } from '../auth-user';

/**
 * Service to add the jwt token to the request.
 */
@Injectable({
	providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
	constructor(private authService: AuthService) {}

	/**
	 * Intercepts the HTTP request and attaches the access token to the request headers.
	 * @param {HttpRequest<any>} request - The HTTP request.
	 * @param {HttpHandler} next - The HTTP handler.
	 * @returns {Observable<HttpEvent<any>>} The observable HTTP event.
	 */
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		console.log('test');
		return this.authService.user.pipe(
			take(1),
			exhaustMap((user: AuthUser) => {
				if (!user || !user.access_token) {
					return next.handle(request);
				}
				const modifiedRequest = request.clone({
					setHeaders: {
						Authorization: `Bearer ${user.access_token}`,
					},
				});
				return next.handle(modifiedRequest);
			}),
		);
	}
}
