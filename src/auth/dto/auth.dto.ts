import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PeopleResponse } from 'src/people/dto/people-response.dto';
import { People } from 'src/people/schema/people.schema';

export class PeopleRegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty()
  fullname: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty()
  password: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  countryCode?: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  country?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  address?: string;
}

export class PeopleLoginDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email!: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

class AuthTokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class PeopleAuthResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: AuthTokensDto })
  tokens: AuthTokensDto;

  @ApiProperty({ type: PeopleResponse })
  user: PeopleResponse;

  constructor(data: {
    message: string;
    tokens: Record<'accessToken' | 'refreshToken', string>;
    user: People | PeopleResponse;
  }) {
    ((this.message = data.message), (this.tokens = data.tokens));
    this.user =
      data.user instanceof PeopleResponse
        ? data.user
        : new PeopleResponse(data.user);
  }
}
