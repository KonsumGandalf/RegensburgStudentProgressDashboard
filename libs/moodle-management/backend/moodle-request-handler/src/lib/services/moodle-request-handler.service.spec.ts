import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MockConfigService } from '@rspd/shared/backend/test-util';
import { MoodleConfig } from '@rspd/shared/backend/utils';
import { of } from 'rxjs';

import { MoodleRequestHandlerService } from './moodle-request-handler.service';

describe('MoodleRequestHandlerService', () => {
	let service: MoodleRequestHandlerService;
	let httpService: HttpService;
	let configService: MockConfigService<MoodleConfig>;
	let moodleParams: MoodleConfig;

	beforeEach(async () => {
		moodleParams = {
			username: 'test-username',
			service: 'test-service',
			password: 'test-password',
			host: 'localhost/',
		};

		configService = new MockConfigService<MoodleConfig>({
			moodle: moodleParams,
		});

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MoodleRequestHandlerService,
				{
					provide: ConfigService,
					useValue: configService,
				},
				{
					provide: HttpService,
					useValue: {
						get: jest.fn().mockImplementation((args) => of({ data: { ...args } })),
						post: jest
							.fn()
							.mockImplementation(() => of({ data: { token: 'test-token' } })),
					},
				},
			],
		}).compile();

		service = module.get(MoodleRequestHandlerService);
		httpService = module.get(HttpService);
	});

	describe('getApiUrl', () => {
		it('should construct the apiUrl correctly', () => {
			const url = service.getApiUrl();
			expect(url).toEqual('localhost/webservice/rest/server.php?');
		});
	});

	describe('login', () => {
		it('should construct the loginUrl correctly and return a token', async () => {
			const expectedUrl = 'localhost/login/token.php';
			const reponse = await service.login();

			expect(httpService.post).toBeCalledWith(expectedUrl, undefined, {
				params: {
					username: moodleParams.username,
					password: moodleParams.password,
					service: moodleParams.service,
				},
			});
			expect(reponse).toEqual('test-token');
		});
	});

	describe('get', () => {
		it('call the api correctly', async () => {
			const reponse = await service.get('test-function', { test: 'test-param' });

			expect(httpService.get).toBeCalledWith(undefined, {
				params: {
					wsfunction: 'test-function',
					moodlewsrestformat: 'json',
					wstoken: undefined,
					test: 'test-param',
				},
			});
			expect(reponse).toBeDefined();
		});
	});
});
