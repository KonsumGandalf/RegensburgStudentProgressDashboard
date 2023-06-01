import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class GithubOauthGuard extends AuthGuard('github') {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		console.log(request.user);
		context.switchToHttp().getRequest().session.userId = request.user.id;
		context.switchToHttp().getRequest().session.test = 'q2eq2e';
		return super.canActivate(context); // Call the parent canActivate method
	}
}

