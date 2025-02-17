import { OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/shared';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password', 'username'])) {
  @IsOptional()
  @IsString()
  @IsEnum(UserRole)
  role: UserRole;
}

export class UserLoginDTO extends PartialType(PickType(CreateUserDto, ['password', 'username'])) {}
