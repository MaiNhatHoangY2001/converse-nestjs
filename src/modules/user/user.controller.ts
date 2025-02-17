import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { UserRole } from 'src/shared';
import { AppError, ErrNotFound } from 'src/shared/app-error';
import { RemoteAuthGuard, Roles, RolesGuard } from 'src/shared/guard';
import { ReqWithRequester } from 'src/shared/interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDTO } from './dto/user-action.dto';
import { USER_REPOSITORY, USER_SERVICE } from './user.di-token';
import { UserUpdateDTO, UserUpdateProfileDTO } from './user.dto';
import { ErrInvalidToken, User } from './user.model';
import { IUserRepository, IUserService } from './user.port';

@Controller()
export class UserController {
  constructor(@Inject(USER_SERVICE) private readonly userService: IUserService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() dto: CreateUserDto) {
    const data = await this.userService.register(dto);
    return { data };
  }

  @Post('authenticate')
  @HttpCode(HttpStatus.OK)
  async authenticate(@Body() dto: UserLoginDTO) {
    const data = await this.userService.login(dto);
    return { data };
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async profile(@Request() req: ExpressRequest) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || token === undefined) {
      return AppError.from(ErrInvalidToken, 400);
    }

    const requester = await this.userService.introspectToken(token);
    const data = await this.userService.profile(requester.sub);
    return { data };
  }

  @Patch('profile')
  @UseGuards(RemoteAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateProfile(@Request() req: ReqWithRequester, @Body() dto: UserUpdateProfileDTO) {
    const requester = req.requester;
    await this.userService.update(requester, requester.sub, dto);
    return { data: true };
  }

  @Patch('users/:id')
  @UseGuards(RemoteAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Request() req: ReqWithRequester,
    @Param('id') id: string,
    @Body() dto: UserUpdateDTO,
  ) {
    // 200Lab TODO: can be omitted, because we already check in guards
    const requester = req.requester;
    await this.userService.update(requester, id, dto);
    return { data: true };
  }

  @Delete('users/:id')
  @UseGuards(RemoteAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Request() req: ReqWithRequester, @Param('id') id: string) {
    // 200Lab TODO: can be omitted, because we already check in guards
    const requester = req.requester;
    await this.userService.delete(requester, id);
    return { data: true };
  }
}

@Controller('rpc')
export class UserRpcController {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  @Post('introspect')
  @HttpCode(HttpStatus.OK)
  async introspect(@Body() dto: { token: string }) {
    const result = await this.userService.introspectToken(dto.token);
    return { data: result };
  }

  @Get('users/:id')
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('id') id: string) {
    const user = await this.userRepository.get(id);

    if (!user) {
      throw AppError.from(ErrNotFound, 400);
    }

    return { data: this._toResponseModel(user) };
  }

  @Post('users/list-by-ids')
  @HttpCode(HttpStatus.OK)
  async listUsersByIds(@Body('ids') ids: string[]) {
    const data = await this.userRepository.listByIds(ids);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    return { data: data.map(this._toResponseModel) };
  }

  private _toResponseModel(data: User): Omit<User, 'password' | 'salt'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, salt, ...rest } = data;
    return rest;
  }
}
