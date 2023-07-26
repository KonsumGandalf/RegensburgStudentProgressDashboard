import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, createUrlTreeFromSnapshot } from '@angular/router';
import { AuthService } from '@rspd/user/frontend/auth';

export const GithubConnectionGuard = (next: ActivatedRouteSnapshot) => {
	if (!inject(AuthService).user()?.isGithubValidated) {
		return createUrlTreeFromSnapshot(next, ['/', 'connect-github']);
	}

	return true;
};
