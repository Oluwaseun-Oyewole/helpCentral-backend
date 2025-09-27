import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

class BaseEmailParamsDto {
  @IsNotEmpty()
  @IsEmail()
  to: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  body?: string;
}

export class SendRegisterEmailDto extends BaseEmailParamsDto {
  @IsString()
  name: string;

  @IsUrl({
    allow_fragments: false,
    require_protocol: true,
    protocols: ['https', 'http'],
  })
  link: string;
}
