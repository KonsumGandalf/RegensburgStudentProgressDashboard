import { IGithubUser } from '@rspd/shared/backend/utils';

export interface IGithubRequest extends Request{
	user: IGithubUser;
}
