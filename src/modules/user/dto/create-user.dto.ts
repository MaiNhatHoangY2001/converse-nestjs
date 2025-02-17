import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ErrUsernameInvalid } from '../user.model';

export class CreateUserDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@MinLength(2)
	firstName: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@MinLength(2)
	lastName: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	@MaxLength(25)
	@Matches(/^[a-zA-Z0-9_]+$/, { message: ErrUsernameInvalid.message })
	username: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	password: string;
}
