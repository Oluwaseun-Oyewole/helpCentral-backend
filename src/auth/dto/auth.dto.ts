import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ChildrenResponse } from 'src/children/dto/children-response.dto';
import { allowedGenders, Children } from 'src/children/schema/children.schema';
import { SponsorResponse } from 'src/sponsors/dto/sponsor-response.dto';
import { schoolNeeds } from './../../children/schema/children.schema';

export class ChildrenRegisterDto {
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

  @IsString()
  @IsOptional()
  @ApiProperty()
  state?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  image?: string;

  @IsOptional()
  @ApiProperty()
  gender: (typeof allowedGenders)[number];

  @ApiProperty()
  schoolNeeds: (typeof schoolNeeds)[number];

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  address: string;
}

export class SponsorRegisterDto {
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
}

export class verifyAccountDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  token: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class LoginDto {
  @ApiProperty({ description: 'Email of the child' })
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

export class ChildrenAuthResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: AuthTokensDto })
  tokens: AuthTokensDto;

  @ApiProperty({ type: ChildrenResponse })
  user: ChildrenResponse;

  constructor(data: {
    message: string;
    tokens: Record<'accessToken' | 'refreshToken', string>;
    user: Children | ChildrenResponse;
  }) {
    ((this.message = data.message), (this.tokens = data.tokens));
    this.user =
      data.user instanceof ChildrenResponse
        ? data.user
        : new ChildrenResponse(data.user);
  }
}

export class SponsorsAuthResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: AuthTokensDto })
  tokens: AuthTokensDto;

  @ApiProperty({ type: SponsorResponse })
  user: SponsorResponse;

  constructor(data: {
    message: string;
    tokens: Record<'accessToken' | 'refreshToken', string>;
    user: Children | SponsorResponse;
  }) {
    ((this.message = data.message), (this.tokens = data.tokens));
    this.user =
      data.user instanceof SponsorResponse
        ? data.user
        : new SponsorResponse(data.user);
  }
}
