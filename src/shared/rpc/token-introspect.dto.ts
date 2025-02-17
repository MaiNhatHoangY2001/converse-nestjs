import { ApiProperty } from '@nestjs/swagger';

export class TokenIntrospectDto {
	@ApiProperty()
	token: string;
}
