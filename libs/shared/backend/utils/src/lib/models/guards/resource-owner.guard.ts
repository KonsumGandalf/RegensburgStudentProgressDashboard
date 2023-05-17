import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Inject,
	Injectable,
} from '@nestjs/common';
import { IRequestLogin, IUser } from '@rspd/user/backend/common-models';
import { Observable } from 'rxjs';

import { ResourceProvider } from '../enums/resource-provider.enum';
import { UserRole } from '../enums/user-role.enum';
import { IResourceOwnerChecker } from '../interfaces/resource-owner-checker.interface';
import { RESOURCE_PROVIDER_TOKEN } from '../token/resource-provider.token';

/**
 * Guard ensures that a resource can just be requested by its owner or a tutor
 */
@Injectable()
export class ResourceOwnerGuard implements CanActivate {
	constructor(
		@Inject(RESOURCE_PROVIDER_TOKEN(ResourceProvider.SUBMISSION))
		readonly _resourceOwnerChecker: IResourceOwnerChecker,
	) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const resourceId = request.params.id;
		const { role, username } = (request as IRequestLogin).user;

		if (role === UserRole.TUTOR) {
			return true;
		}

		return this._resourceOwnerChecker.checkOwnership(resourceId, username).then((result) => {
			if (!result) {
				throw new ForbiddenException('You are not authorized to access this resource');
			}
			return true;
		});
	}
}
