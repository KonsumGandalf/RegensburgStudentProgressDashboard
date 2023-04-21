import { IComplexUser } from '@rspd/user/backend/user-management';

export interface IAuthUser {
    user: IComplexUser;
    password: string;
}
