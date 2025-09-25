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
import { PeopleResponse } from 'src/people/dto/people-response.dto';
import { PeopleService } from 'src/people/people.service';
import { USER_MODELS } from 'src/shared/enums/index.enum';
import { generateLongToken } from 'src/shared/utils/index.utils';
import { UserSessionsService } from 'src/user-sessions/user-sessions.service';
import { TOKEN_TYPES } from 'src/user-tokens/schema/user-token.schema';
import { UserTokensService } from 'src/user-tokens/user-tokens.service';
import appConfig from '../shared/config/index.config';
import { AccessJWTPayload, LoginMode } from './auth.interface';
import {
  ForgotPasswordDto,
  PeopleLoginDto,
  PeopleRegisterDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => PeopleService))
    private readonly peopleService: PeopleService,
    private readonly userTokenService: UserTokensService,
    private readonly jwtService: JwtService,
    private readonly userSessionsService: UserSessionsService,
  ) {}

  async peopleLogin(data: PeopleLoginDto, mode: LoginMode) {
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

  async peopleRegister(data: PeopleRegisterDto) {
    const { email, fullname } = data;
    const savedUser = await this.peopleService.createUser({ ...data });
    const emailVerificationToken = generateLongToken();
    console.log('first', emailVerificationToken);
    const tokenExpires = new Date(new Date().getTime() + 5 * 60 * 1000); //5 minutes
    const { id: userId } = savedUser;

    await this.userTokenService.saveUserToken({
      userId,
      token: emailVerificationToken,
      tokenExpires,
      type: TOKEN_TYPES.EMAIL_VERIFICATION,
      userType: USER_MODELS.PEOPLE,
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

  async peopleForgotPassword(input: ForgotPasswordDto, userType: USER_MODELS) {
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

      return {
        message: 'Reset Password Guidelines has been sent to your mail',
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
}
