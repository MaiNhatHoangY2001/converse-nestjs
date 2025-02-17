import { AppEvent, PublicUser } from './data-model';
import { UserRole } from './enum';

export interface TokenPayload {
  sub: string;
  role: UserRole;
}

export type Requester = TokenPayload;

export interface ReqWithRequester {
  requester: Requester;
}
export interface ReqWithRequesterOpt {
  requester?: Requester;
}

export type TokenIntrospectResult = {
  payload: TokenPayload | null;
  error?: Error;
  isOk: boolean;
};

export interface ITokenIntrospect {
  introspect(token: string): Promise<TokenIntrospectResult>;
}

export interface ITokenProvider {
  // generate access token
  generateToken(payload: TokenPayload): Promise<string>;
  verifyToken(token: string): Promise<TokenPayload | null>;
}

export interface IAuthorRpc {
  findById(id: string): Promise<PublicUser | null>;
  findByIds(ids: Array<string>): Promise<Array<PublicUser>>;
}

export interface IEventPublisher {
  publish<T>(event: AppEvent<T>): Promise<void>;
}

export type EventHandler = (msg: string) => void;

export type IPublicUserRpc = IAuthorRpc;
