import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtTokenService } from 'src/shared/components/jwt';
import { ShareModule } from 'src/shared/module';
import { UserPrismaRepository } from './user-prisma.repo';
import { UserController, UserRpcController } from './user.controller';
import { TOKEN_PROVIDER, USER_REPOSITORY, USER_SERVICE } from './user.di-token';
import { UserService } from './user.service';

const repositories: Provider[] = [{ provide: USER_REPOSITORY, useClass: UserPrismaRepository }];

const services: Provider[] = [{ provide: USER_SERVICE, useClass: UserService }];

const tokenProvider: Provider = {
	provide: TOKEN_PROVIDER,
	useFactory: (configService: ConfigService) => {
		const tokenJWT = configService.get<string>('rpc.jwtSecret');
		return new JwtTokenService(tokenJWT as string, '7d');
	},
	inject: [ConfigService],
};

@Module({
	imports: [ShareModule],
	controllers: [UserController, UserRpcController],
	providers: [...repositories, ...services, tokenProvider],
})
export class UserModule {}
