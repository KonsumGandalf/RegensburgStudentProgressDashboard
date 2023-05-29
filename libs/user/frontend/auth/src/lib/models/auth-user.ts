export class AuthUser {
	constructor(
		public readonly _access_token: string,
		public readonly _tokenExpirationDate: Date,
	) {}

	get access_token() {
		if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
			return null;
		}
		return this._access_token;
	}
}
