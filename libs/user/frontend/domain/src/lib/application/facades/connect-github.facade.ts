import { Injectable } from '@angular/core';
import { ILoginUser, IResponseAuthentication } from '@rspd/user/common/models';
import { GeneralUserFacade } from '@rspd/user/frontend/domain';
import { Observable } from 'rxjs';

import { UserRepository } from '../../infrastructure/user.repository';

/**
 * Facade for the user domain in the context of connecting the user account to a github one
 */
@Injectable({ providedIn: 'root' })
export class ConnectGithubFacade {


}
