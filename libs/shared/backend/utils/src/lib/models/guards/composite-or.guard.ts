import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	SetMetadata,
	Type,
	UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';

export const CompositeOrGuardReferences = (...guards: Type<CanActivate>[]) =>
	SetMetadata('compositeOrGuardReferences', guards);

/**
 * This Guard is not used and not tested jest, the code remains for later development
 * It should allow to call this `CompositeOrGuard` and `@CompositeOrGuardReferences` and just one of
 * the provided Guards must return true
 */

@Injectable()
export class CompositeOrGuard implements CanActivate {
	constructor(private readonly reflector: Reflector, private readonly moduleRef: ModuleRef) {}

	canActivate(context: ExecutionContext): Observable<boolean> {
		const allowedGuards =
			this.reflector.get<Type<CanActivate>[]>(
				'compositeOrGuardReferences',
				context.getHandler(),
			) || [];
		const guards = allowedGuards.map((guardReference) =>
			this.moduleRef.get<CanActivate>(guardReference),
		);

		const checks$: Observable<boolean>[] = guards.map((guard) =>
			(guard.canActivate(context) as Observable<boolean>).pipe(
				catchError((err) => {
					if (err instanceof UnauthorizedException) {
						return of(false);
					} else if (err instanceof ForbiddenException) {
						return of(false);
					}
					throw err;
				}),
			),
		);
		return forkJoin(checks$).pipe(
			map((results: boolean[]) => results.some((result) => result === true)),
		);
	}
}
