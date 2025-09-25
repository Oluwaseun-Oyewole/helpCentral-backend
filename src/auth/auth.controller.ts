import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/shared/decorators/request/public-request.decorator';
import { USER_MODELS } from 'src/shared/enums/index.enum';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  PeopleAuthResponseDto,
  PeopleLoginDto,
  PeopleRegisterDto,
} from './dto/auth.dto';
import { GoogleOAuthGuard } from './guards/google-auth/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @Public()
  @Post('/login')
  async peopleLogin(
    @Body() body: PeopleLoginDto,
  ): Promise<PeopleAuthResponseDto> {
    return await this.authService
      .peopleLogin(body, 'credential_provider')
      .catch((error: Error) => {
        throw new BadRequestException(error.message || error, { cause: error });
      });
  }

  @ApiBearerAuth()
  @Public()
  @Post('/register')
  async peopleRegister(
    @Body() body: PeopleRegisterDto,
  ): Promise<PeopleAuthResponseDto> {
    return await this.authService.peopleRegister(body).catch((error: Error) => {
      throw new BadRequestException(error.message || error, { cause: error });
    });
  }

  @ApiBearerAuth()
  @Public()
  @Post('/people/forgotPassword')
  async peopleForgotPassword(@Body() body: ForgotPasswordDto) {
    return await this.authService
      .peopleForgotPassword(body, USER_MODELS.PEOPLE)
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  @Public()
  @UseGuards(GoogleOAuthGuard)
  @Get('/google/login')
  async googleLogin() {}

  @Public()
  @UseGuards(GoogleOAuthGuard)
  @Get('/google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.authService
      .peopleLogin(
        { email: req.user.email, password: req.user.password },
        'oauth',
      )
      .catch((error: Error) => {
        throw new BadRequestException(error.message || error, {
          cause: error,
        });
      });
    res.redirect(
      `http://localhost:4000?token=${response?.tokens?.accessToken}`,
    );
  }
}
