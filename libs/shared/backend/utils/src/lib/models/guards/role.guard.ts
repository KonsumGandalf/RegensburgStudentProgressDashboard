import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IUser } from '@rspd/user/backend/common-models';

import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
			context.getHandler(),
			context.getClass(),
		]);

		if (!requiredRoles) {
			// if the `role` decorator is not set, allow access
			return true;
		}

		const user = context.switchToHttp().getRequest().user as IUser;
		if (!user) {
			// if there is no user, disallow access
			return false;
		}

		return requiredRoles.some((role) => user.role == role);
	}
}
