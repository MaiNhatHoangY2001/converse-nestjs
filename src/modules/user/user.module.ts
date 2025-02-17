import { Module, Provider } from '@nestjs/common';
import { config } from 'src/shared';
import { JwtTokenService } from 'src/shared/components/jwt';
import { ShareModule } from 'src/shared/module';
import { UserPrismaRepository } from './user-prisma.repo';
import { UserController, UserRpcController } from './user.controller';
import { TOKEN_PROVIDER, USER_REPOSITORY, USER_SERVICE } from './user.di-token';
import { UserService } from './user.service';

const repositories: Provider[] = [{ provide: USER_REPOSITORY, useClass: UserPrismaRepository }];

const services: Provider[] = [{ provide: USER_SERVICE, useClass: UserService }];

const tokenJWTProvider = new JwtTokenService(config.rpc.jwtSecret, '7d');
const tokenProvider: Provider = { provide: TOKEN_PROVIDER, useValue: tokenJWTProvider };

@Module({
  imports: [ShareModule],
  controllers: [UserController, UserRpcController],
  providers: [...repositories, ...services, tokenProvider],
})
export class UserModule {}
