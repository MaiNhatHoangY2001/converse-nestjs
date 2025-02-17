import { Requester, TokenPayload } from 'src/shared/interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDTO, UserUpdateDto } from './dto/user-action.dto';
import { UserCondDTO } from './user.dto';
import { User } from './user.model';

export interface IUserService {
	register(dto: CreateUserDto): Promise<string>;
	login(dto: UserLoginDTO): Promise<string>;
	profile(userId: string): Promise<Omit<User, 'password' | 'salt'>>;
	update(requester: Requester, userId: string, dto: UserUpdateDto): Promise<void>;
	delete(requester: Requester, userId: string): Promise<void>;
	// introspect token rpc
	introspectToken(token: string): Promise<TokenPayload>;
}

export interface IUserRepository {
	// Query
	get(id: string): Promise<User | null>;
	findByCond(cond: UserCondDTO): Promise<User | null>;
	listByIds(ids: string[]): Promise<User[]>;
	// Command
	insert(user: User): Promise<void>;
	update(id: string, dto: UserUpdateDto): Promise<void>;
	delete(id: string, isHard: boolean): Promise<void>;
}
