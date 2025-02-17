import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Status, UserRole } from 'src/shared';
import { CreateUserDto } from './create-user.dto';

export class UserUpdateDto extends PartialType(OmitType(CreateUserDto, ['password', 'username'])) {
	@ApiProperty({ enum: UserRole })
	@IsString()
	@IsEnum(UserRole)
	role: UserRole;

	@ApiProperty({ enum: Status })
	@IsString()
	@IsEnum(Status)
	status: Status;
}

export class UserLoginDTO extends PartialType(PickType(CreateUserDto, ['password', 'username'])) {}
