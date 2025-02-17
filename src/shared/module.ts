import { Module, Provider } from '@nestjs/common';
import { RedisClient } from './components';
import { config } from './config';
import { EVENT_PUBLISHER, TOKEN_INTROSPECTOR, USER_RPC } from './di-token';
import { TokenIntrospectRPCClient, UserRPCClient } from './rpc';

const tokenRPCClient = new TokenIntrospectRPCClient(config.rpc.introspectUrl);
const tokenIntrospector: Provider = {
	provide: TOKEN_INTROSPECTOR,
	useValue: tokenRPCClient,
};

const userRPCClient = new UserRPCClient(config.rpc.userServiceURL);
const userRPC: Provider = {
	provide: USER_RPC,
	useValue: userRPCClient,
};

const redisClient: Provider = {
	provide: EVENT_PUBLISHER,
	useFactory: async () => {
		await RedisClient.init(config.redis.url);
		return RedisClient.getInstance();
	},
};

@Module({
	providers: [tokenIntrospector, userRPC, redisClient],
	exports: [tokenIntrospector, userRPC, redisClient],
})
export class ShareModule {}
