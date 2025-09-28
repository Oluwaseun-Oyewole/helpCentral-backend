import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailService } from 'src/integration-services/mail/mail-service';
import { PeopleResponse } from 'src/people/dto/people-response.dto';
import { PeopleService } from 'src/people/people.service';
import { USER_MODELS } from 'src/shared/enums/index.enum';
import { generateLongToken, hashPassword } from 'src/shared/utils/index.utils';
import { SponsorResponse } from 'src/sponsors/dto/sponsor-response.dto';
import { SponsorsService } from 'src/sponsors/sponsors.service';
import { UserSessionsService } from 'src/user-sessions/user-sessions.service';
import { TOKEN_TYPES } from 'src/user-tokens/schema/user-token.schema';
import { UserTokensService } from 'src/user-tokens/user-tokens.service';
import appConfig from '../shared/config/index.config';
import { AccessJWTPayload, LoginMode } from './auth.interface';
import {
  ForgotPasswordDto,
  LoginDto,
  PeopleRegisterDto,
  SponsorRegisterDto,
  verifyAccountDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => PeopleService))
    private readonly peopleService: PeopleService,
    private readonly sponsorService: SponsorsService,
    private readonly userTokenService: UserTokensService,
    private readonly jwtService: JwtService,
    private readonly userSessionsService: UserSessionsService,
    private mailService: MailService,
  ) {}

  async peopleLogin(data: LoginDto, mode: LoginMode) {
    try {
      const { email, password } = data;
      const user =
        await this.peopleService.peopleRepository.getUserWithPassword({
          email,
        });

      if (!user) return Promise.reject('Invalid Credentials.');
      if (!user.activatedAt)
        return Promise.reject('Please activate your account.');
      if (mode === 'credential_provider') {
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) return Promise.reject('Invalid Credentials.');
      }
      const [tokens] = await Promise.all([
        this.getTokens({
          email,
          id: user._id.toString(),
          name: user.fullname,
          type: USER_MODELS.PEOPLE,
        }),
      ]);
      this.peopleService.peopleRepository.update(user._id, {
        $set: { lastLoginDate: new Date().toISOString() },
      });
      return {
        message: 'Login Successful',
        tokens,
        user: new PeopleResponse(user),
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async sponsorLogin(data: LoginDto, mode: LoginMode) {
    try {
      const { email, password } = data;
      const user =
        await this.sponsorService.sponsorRepository.getUserWithPassword({
          email,
        });

      if (!user) return Promise.reject('Invalid Credentials.');
      if (!user.activatedAt)
        return Promise.reject('Please activate your account.');
      if (mode === 'credential_provider') {
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) return Promise.reject('Invalid Credentials.');
      }
      const [tokens] = await Promise.all([
        this.getTokens({
          email,
          id: user._id.toString(),
          name: user.fullname,
          type: USER_MODELS.SPONSOR,
        }),
      ]);
      this.sponsorService.sponsorRepository.update(user._id, {
        $set: { lastLoginDate: new Date().toISOString() },
      });
      return {
        message: 'Login Successful',
        tokens,
        user: new SponsorResponse(user),
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async peopleRegister(data: PeopleRegisterDto) {
    const { email, fullname } = data;
    const savedUser = await this.peopleService.createUser({ ...data });
    const emailVerificationToken = generateLongToken();
    const emailVerificationLink = `${appConfig().appLink}/verify/?token=${emailVerificationToken}&email=${savedUser.email}`;
    const tokenExpires = new Date(new Date().getTime() + 15 * 60 * 1000); //15 minutes
    const { id: userId } = savedUser;

    await this.userTokenService.saveUserToken({
      userId,
      token: emailVerificationToken,
      tokenExpires,
      type: TOKEN_TYPES.EMAIL_VERIFICATION,
      userType: USER_MODELS.PEOPLE,
    });

    await this.mailService.sendRegistrationEmail({
      to: email,
      name: fullname,
      link: emailVerificationLink,
    });

    const tokens = await this.getTokens({
      email,
      id: userId,
      name: fullname,
      type: USER_MODELS.PEOPLE,
    });

    return {
      message: 'Registration successful',
      tokens,
      user: savedUser,
    };
  }

  async sponsorRegister(data: SponsorRegisterDto) {
    const { email, fullname } = data;
    const savedUser = await this.sponsorService.createUser({ ...data });
    const emailVerificationToken = generateLongToken();
    const emailVerificationLink = `${appConfig().appLink}/verify/?token=${emailVerificationToken}&email=${savedUser.email}`;
    const tokenExpires = new Date(new Date().getTime() + 15 * 60 * 1000); //15 minutes
    const { id: userId } = savedUser;

    await this.userTokenService.saveUserToken({
      userId,
      token: emailVerificationToken,
      tokenExpires,
      type: TOKEN_TYPES.EMAIL_VERIFICATION,
      userType: USER_MODELS.SPONSOR,
    });

    await this.mailService.sendRegistrationEmail({
      to: email,
      name: fullname,
      link: emailVerificationLink,
    });

    const tokens = await this.getTokens({
      email,
      id: userId,
      name: fullname,
      type: USER_MODELS.SPONSOR,
    });

    return {
      message: 'Registration successful',
      tokens,
      user: savedUser,
    };
  }

  async verifyPeopleAccount(input: verifyAccountDto) {
    try {
      const isTokenValid =
        await this.userTokenService.checkEmailTokenIsValid(input);
      const details = await this.getUserTypeDetails(USER_MODELS.PEOPLE, {
        email: input.email,
      });
      if (!isTokenValid) Promise.reject('Invalid token');
      if (!details || !details?.user) throw new Error('User Does Not Exist');
      if (details?.user.activatedAt) throw new Error('User already activated');
      await this.peopleService.peopleRepository.update(details.user.id, {
        $set: {
          activatedAt: new Date().toISOString(),
        },
      });
      await this.userTokenService.deleteAllUserToken(details.user.id);
      return {
        message: 'Account successfully activated',
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async verifySponsorAccount(input: verifyAccountDto) {
    try {
      const isTokenValid =
        await this.userTokenService.checkEmailTokenIsValid(input);
      const details = await this.getUserTypeDetails(USER_MODELS.SPONSOR, {
        email: input.email,
      });
      if (!isTokenValid) Promise.reject('Invalid token');
      if (!details || !details?.user) throw new Error('User Does Not Exist');
      if (details?.user.activatedAt) throw new Error('User already activated');
      await this.sponsorService.sponsorRepository.update(details.user.id, {
        $set: {
          activatedAt: new Date().toISOString(),
        },
      });
      await this.userTokenService.deleteAllUserToken(details.user.id);
      return {
        message: 'Account successfully activated',
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async resendEmailLink(input: verifyAccountDto) {
    try {
      const user = await this.peopleService.checkIfUserExist({
        email: input.email,
      });
      if (!user) throw new Error('User Does Not Exist');

      if (!user) throw new Error('User Does Not Exist');
      if (user.activatedAt) throw new Error('User already activated');

      const emailVerificationToken = generateLongToken();
      const emailVerificationLink = `${appConfig().appLink}/verify/?token=${emailVerificationToken}&email=${user.email}`;
      const tokenExpires = new Date(new Date().getTime() + 15 * 60 * 1000); //15 minutes
      const { id: userId } = user;

      await this.userTokenService.saveUserToken({
        userId,
        token: emailVerificationToken,
        tokenExpires,
        type: TOKEN_TYPES.EMAIL_VERIFICATION,
      });

      await this.mailService.sendRegistrationEmail({
        to: user.email,
        name: user.fullname,
        link: emailVerificationLink,
      });

      return {
        message: 'Link sent to your email address',
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async forgotPassword(input: ForgotPasswordDto, userType: USER_MODELS) {
    try {
      const { email } = input;
      const details = await this.getUserTypeDetails(userType, { email });
      if (!details || !details?.user) throw new Error('User Does Not Exist');
      const resetPasswordToken = generateLongToken();
      const resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await this.userTokenService.saveUserToken({
        userId: details.user.id,
        token: resetPasswordToken,
        tokenExpires: resetPasswordExpire,
        type: TOKEN_TYPES.FORGOT_PASSWORD,
        userType,
      });
      const emailResetLink = `${appConfig().appLink}/reset/?token=${resetPasswordToken}&email=${details.user.email}`;
      await this.mailService.sendRegistrationEmail({
        to: details.user.email,
        name: details.user.fullname,
        link: emailResetLink,
      });

      return {
        message: 'Reset Password Guidelines has been sent to your mail',
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async resetPassword(input: Record<'password' | 'token', string>) {
    try {
      const { password, token } = input;
      const userToken = await this.userTokenService.checkTokenIsValid(
        token,
        TOKEN_TYPES.FORGOT_PASSWORD,
      );
      const userDetails = await this.getUserTypeDetails(userToken.userModel, {
        id: userToken.user.toString(),
      });
      if (!userDetails || !userDetails?.user) throw new Error('Invalid User');
      const hashedPassword = await hashPassword(password);
      const { id: userId } = userDetails.user;
      await this.updatePasswordOfUserType(
        userDetails.type,
        userId,
        hashedPassword,
      );
      await this.userSessionsService.deleteAllUserSession(userId);
      return {
        message: 'Password Reset Successful',
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async verifyUserJWTToken(token: string) {
    try {
      const payload: AccessJWTPayload & { jti: string } =
        await this.jwtService.verifyAsync(token, {
          secret: appConfig().jwtsecretkey,
          issuer: appConfig().appname,
        });
      if (!payload) throw new ForbiddenException('Invalid token');
      const userSession =
        await this.userSessionsService.checkIfTokenJTIExistsInSessions(
          payload.id,
          payload.jti,
        );
      if (!userSession) throw new ForbiddenException('Invalid User Session');
      return payload;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async logout(userId: string) {
    try {
      await this.userSessionsService.deleteAllUserSession(userId);
      return Promise.resolve('Logout Successful.');
    } catch (error) {
      return Promise.resolve('Logout Successful.');
    }
  }

  private async getUserTypeDetails(
    type: USER_MODELS,
    user: Partial<Record<'id' | 'email', string>>,
  ) {
    switch (type) {
      case USER_MODELS.PEOPLE: {
        const details = await this.peopleService.checkIfUserExist(user);
        if (!details) return Promise.reject('Invalid user');
        return { type: type, user: details };
      }
      default:
        throw new NotFoundException('Invalid User');
    }
  }
  private async getTokens(
    payload: AccessJWTPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const token = crypto.randomBytes(36).toString('hex');
    const jti = crypto.createHash('sha256').update(token).digest('hex');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: appConfig().jwtsecretkey,
        jwtid: jti,
        expiresIn: appConfig().accesstokenexpires,
        issuer: appConfig().appname,
      }),
      this.jwtService.signAsync(
        { id: payload.id, type: payload.type },
        {
          secret: appConfig().jwtrefreshsecretkey,
          jwtid: jti,
          expiresIn: appConfig().refreshtokenexpires,
          issuer: appConfig().appname,
        },
      ),
    ]);
    await this.userSessionsService.saveUserSession({
      user: payload.id,
      jti,
      userModel: payload.type,
      payload,
    });
    return { accessToken, refreshToken };
  }
  async validateGoogleUser(data: PeopleRegisterDto) {
    const savedUser = await this.peopleService.createUser({ ...data });
    return savedUser;
  }

  private async updatePasswordOfUserType(
    type: USER_MODELS,
    userId: string,
    password: string,
  ) {
    switch (type) {
      case USER_MODELS.PEOPLE: {
        const details = await this.peopleService.peopleRepository.update(
          userId,
          { password },
        );
        if (!details) return Promise.reject('Invalid user');
        return { type: type, user: details };
      }
      case USER_MODELS.SPONSOR: {
        const details = await this.sponsorService.sponsorRepository.update(
          userId,
          { password },
        );
        if (!details) return Promise.reject('Invalid user');
        return { type, user: details };
      }

      default:
        throw new NotFoundException('Invalid user');
    }
  }
}
