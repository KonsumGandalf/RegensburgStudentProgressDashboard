import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@rspd/shared/backend/utils';
import { AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';

import { ILogin } from '../interfaces/login.interface';

@Injectable()
export class MoodleRequestHandlerService implements OnModuleInit {
	private token?: string;
	private apiUrl?: string;

	constructor(
		private readonly _httpService: HttpService,
		private readonly _configService: ConfigService<AppConfig>,
	) {}

	async onModuleInit() {
		// this.apiUrl = this.getApiUrl();
		// this.token = await this.login();
	}

	getApiUrl() {
		const { host } = this._configService.get('moodle', {
			infer: true,
		});
		return `${host}webservice/rest/server.php?`;
	}

	async login() {
		const { username, service, password, host } = this._configService.get('moodle', {
			infer: true,
		});

		const loginUrl = `${host}login/token.php`;

		return await firstValueFrom(
			this._httpService
				.post(loginUrl, undefined, {
					params: {
						username: username,
						password: password,
						service: service,
					},
				})
				.pipe(map((response: AxiosResponse<ILogin>) => response.data.token)),
		);
	}

	async get<T>(wsFunction: string, functionParams: any): Promise<T> {
		return await firstValueFrom(
			this._httpService
				.get(this.apiUrl, {
					params: {
						wsfunction: wsFunction,
						wstoken: this.token,
						moodlewsrestformat: 'json',
						...functionParams,
					},
				})
				.pipe(map((response: AxiosResponse<T>) => response.data)),
		);
	}
}
