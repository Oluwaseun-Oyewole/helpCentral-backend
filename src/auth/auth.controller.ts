import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PeopleAuthResponseDto, PeopleRegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(
    @Body() body: PeopleRegisterDto,
  ): Promise<PeopleAuthResponseDto> {
    return await this.authService.peopleRegister(body).catch((error: Error) => {
      throw new BadRequestException(error.message || error, { cause: error });
    });
  }
}
