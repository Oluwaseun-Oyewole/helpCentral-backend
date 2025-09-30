import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/shared/decorators/request/public-request.decorator';
import {
  ErrorApiResponse,
  SuccessApiResponse,
} from 'src/shared/decorators/response/swagger.decorator';
import { USER_MODELS } from 'src/shared/enums/index.enum';
import appConfig from '../shared/config/index.config';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  LoginDto,
  PeopleAuthResponseDto,
  PeopleRegisterDto,
  ResetPasswordDto,
  SponsorRegisterDto,
  SponsorsAuthResponseDto,
  verifyAccountDto,
} from './dto/auth.dto';
import { GoogleOAuthGuard } from './guards/google-auth/google-auth.guard';

@ErrorApiResponse()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @SuccessApiResponse(PeopleAuthResponseDto, {
    description: 'Successfully authenticated and returned access tokens',
  })
  @ApiOperation({ summary: 'People login' })
  @ApiOperation({
    summary: 'Login for people users',
    description:
      'Authenticate people users with email and password credentials',
  })
  // @ApiCreatedResponse({
  //   type: PeopleAuthResponseDto,
  //   description: 'Successfully authenticated and returned access tokens',
  // })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid email or password',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Account not verified or suspended',
  })
  @Public()
  @Post('/people/login')
  async peopleLogin(@Body() body: LoginDto): Promise<PeopleAuthResponseDto> {
    return await this.authService
      .peopleLogin(body, 'credential_provider')
      .catch((error: Error) => {
        throw new BadRequestException(error.message || error, {
          cause: error,
        });
      });
  }

  @ApiBearerAuth()
  @SuccessApiResponse(PeopleAuthResponseDto, {
    description: 'Successfully authenticated and returned access tokens',
  })
  @ApiOperation({ summary: 'Sponsor login' })
  @ApiOperation({
    summary: 'Login for sponsor users',
    description:
      'Authenticate people users with email and password credentials',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid email or password',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Account not verified or suspended',
  })
  @Public()
  @Post('/sponsor/login')
  async sponsorLogin(@Body() body: LoginDto): Promise<SponsorsAuthResponseDto> {
    return await this.authService
      .sponsorLogin(body, 'credential_provider')
      .catch((error: Error) => {
        throw new BadRequestException(error.message || error, {
          cause: error,
        });
      });
  }

  @ApiBearerAuth()
  @Public()
  @Post('/people/register')
  async peopleRegister(
    @Body() body: PeopleRegisterDto,
  ): Promise<PeopleAuthResponseDto> {
    return await this.authService.peopleRegister(body).catch((error: Error) => {
      throw new BadRequestException(error.message || error, {
        cause: error,
      });
    });
  }

  @ApiBearerAuth()
  @Public()
  @Post('/sponsor/register')
  async sponsorRegister(
    @Body() body: SponsorRegisterDto,
  ): Promise<SponsorsAuthResponseDto> {
    return await this.authService
      .sponsorRegister(body)
      .catch((error: Error) => {
        throw new BadRequestException(error.message || error, {
          cause: error,
        });
      });
  }

  @ApiBearerAuth()
  @Public()
  @Post('/people/verify')
  async verifyPeopleAccount(@Body() body: verifyAccountDto) {
    return await this.authService
      .verifyPeopleAccount(body)
      .catch((error: Error) => {
        throw new BadRequestException(error.message || error, {
          cause: error,
        });
      });
  }

  @ApiBearerAuth()
  @Public()
  @Post('/people/verify')
  async verifySponsorAccount(@Body() body: verifyAccountDto) {
    return await this.authService
      .verifySponsorAccount(body)
      .catch((error: Error) => {
        throw new BadRequestException(error.message || error, {
          cause: error,
        });
      });
  }

  @ApiBearerAuth()
  @ApiParam({
    type: 'string',
    name: 'token',
    description: 'Token',
    required: true,
  })
  @ApiOperation({ summary: 'Reset user password' })
  @ApiCreatedResponse({ type: ResetPasswordDto, description: 'Reset' })
  @Public()
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       token: {
  //         type: 'string',
  //         example: 'eedsddd',
  //         description: 'Token type',
  //       },
  //       password: {
  //         type: 'string',
  //         example: 'eedsddd',
  //         description: 'Token type',
  //       },
  //     },
  //   },
  // })
  @Post('/resetpassword/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() body: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return await this.authService
      .resetPassword({ ...body, token })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  @ApiBearerAuth()
  @Public()
  @Post('/resend')
  async resend(@Body() body: verifyAccountDto) {
    return await this.authService
      .resendEmailLink(body)
      .catch((error: Error) => {
        throw new BadRequestException(error.message || error, {
          cause: error,
        });
      });
  }

  @ApiBearerAuth()
  @Public()
  @Post('/people/forgotPassword')
  async peopleForgotPassword(@Body() body: ForgotPasswordDto) {
    return await this.authService
      .forgotPassword(body, USER_MODELS.PEOPLE)
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  @ApiBearerAuth()
  @Public()
  @Post('/people/sponsorPassword')
  async sponsorForgotPassword(@Body() body: ForgotPasswordDto) {
    return await this.authService
      .forgotPassword(body, USER_MODELS.SPONSOR)
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
      `${appConfig().appLink}?token=${response?.tokens?.accessToken}`,
    );
  }
}
