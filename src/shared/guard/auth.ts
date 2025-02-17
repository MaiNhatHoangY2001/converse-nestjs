import { TOKEN_PROVIDER } from '@modules/user/user.di-token';
import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { REMOTE_AUTH_GUARD } from '../di-token';
import { ITokenProvider } from '../interface';

@Injectable()
export class RemoteAuthGuard implements CanActivate {
	constructor(@Inject(TOKEN_PROVIDER) private readonly tokenProvider: ITokenProvider) {}
	// constructor(@Inject(TOKEN_INTROSPECTOR) private readonly introspector: ITokenIntrospect) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const token = extractTokenFromHeader(request);
		if (!token) {
			throw new UnauthorizedException();
		}

		try {
			// const { payload, error, isOk } = await this.introspector.introspect(token);
			// if (!isOk) {
			// 	throw ErrTokenInvalid.withLog('Token parse failed').withLog(error!.message);
			// }

			const payload = await this.tokenProvider.verifyToken(token);

			request['requester'] = payload;
		} catch {
			throw new UnauthorizedException();
		}

		return true;
	}
}

function extractTokenFromHeader(request: Request): string | undefined {
	const [type, token] = request.headers.authorization?.split(' ') ?? [];
	return type === 'Bearer' ? token : undefined;
}

@Injectable()
export class RemoteAuthGuardOptional implements CanActivate {
	constructor(@Inject(REMOTE_AUTH_GUARD) private readonly authGuard: RemoteAuthGuard) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const token = extractTokenFromHeader(request);

		if (!token) {
			return true;
		}

		return this.authGuard.canActivate(context);
	}
}
