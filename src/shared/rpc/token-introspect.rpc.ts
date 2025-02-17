import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ITokenIntrospect, TokenIntrospectResult } from '@shared/interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TokenIntrospectRPCClient implements ITokenIntrospect {
	constructor(
		private readonly url: string,
		private readonly httpService: HttpService,
	) {}

	async introspect(token: string): Promise<TokenIntrospectResult> {
		try {
			Logger.debug(token);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			const response = await lastValueFrom(this.httpService.post(this.url, { token }));
			const { sub, role } = response.data;
			return {
				payload: { sub, role },
				isOk: true,
			};
		} catch (error) {
			return {
				payload: null,
				error: error as Error,
				isOk: false,
			};
		}
	}
}
