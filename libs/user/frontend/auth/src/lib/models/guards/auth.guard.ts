import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, createUrlTreeFromSnapshot, UrlTree } from '@angular/router';

import { AuthService } from '../../services/auth.service';

/**
 * Authentication guard function to protect routes, user entering certain routes when not being authenticated
 * @param {ActivatedRouteSnapshot} next - The next activated route snapshot.
 * @returns {boolean | UrlTree} Returns `true` if the user is authenticated, otherwise returns a `UrlTree` to redirect to the login page.
 */
export const AuthGuard = (next: ActivatedRouteSnapshot) => {
	if (!inject(AuthService).user()?.username) {
		return createUrlTreeFromSnapshot(next, ['/', 'login']);
	}

	return true;
};
