import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { allowedGenders } from './../schema/people.schema';

export class CreatePersonDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  fullname: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @ApiProperty()
  address?: string;

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
  gender?: (typeof allowedGenders)[number];

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty()
  password: string;
}
