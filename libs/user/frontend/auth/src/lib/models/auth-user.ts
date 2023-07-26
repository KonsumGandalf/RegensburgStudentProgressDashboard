export class AuthUser {
	constructor(
		private readonly _access_token: string,
		public readonly _tokenExpirationDate: Date,
		public readonly isGithubValidated: boolean,
		public readonly username: string,
	) {}

	get access_token() {
		if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
			return null;
		}
		return this._access_token;
	}
}
