import { HttpService } from '@nestjs/axios';
import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClient } from './components';
import { EVENT_PUBLISHER, TOKEN_INTROSPECTOR, USER_RPC } from './di-token';
import { TokenIntrospectRPCClient, UserRPCClient } from './rpc';

const tokenIntrospector: Provider = {
	provide: TOKEN_INTROSPECTOR,
	useFactory: (configService: ConfigService, httpService: HttpService) => {
		const introspectUrl = configService.get<string>('rpc.introspectUrl');
		return new TokenIntrospectRPCClient(introspectUrl as string, httpService);
	},
	inject: [ConfigService],
};

const userRPC: Provider = {
	provide: USER_RPC,
	useFactory: (configService: ConfigService) => {
		const userServiceURL = configService.get<string>('rpc.userServiceURL');
		return new UserRPCClient(userServiceURL as string);
	},
	inject: [ConfigService],
};

const redisClient: Provider = {
	provide: EVENT_PUBLISHER,
	useFactory: async (configService: ConfigService) => {
		const redisUrl = configService.get<string>('redis.url');
		await RedisClient.init(redisUrl as string);
		return RedisClient.getInstance();
	},
	inject: [ConfigService],
};

@Module({
	// If ConfigModule isn't global, ensure you import it here:
	// imports: [ConfigModule],
	providers: [tokenIntrospector, userRPC, redisClient],
	exports: [tokenIntrospector, userRPC, redisClient],
})
export class ShareModule {}
