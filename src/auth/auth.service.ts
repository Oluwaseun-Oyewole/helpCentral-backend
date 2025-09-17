import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { PeopleService } from 'src/people/people.service';
import { USER_MODELS } from 'src/shared/enums/index.enum';
import { generateLongToken } from 'src/shared/utils/index.utils';
import { UserSessionsService } from 'src/user-sessions/user-sessions.service';
import { TOKEN_TYPES } from 'src/user-tokens/schema/user-token.schema';
import { UserTokensService } from 'src/user-tokens/user-tokens.service';
import appConfig from '../shared/config/index.config';
import { AccessJWTPayload } from './auth.interface';
import { PeopleRegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => PeopleService))
    private readonly peopleService: PeopleService,
    private readonly userTokenService: UserTokensService,
    private readonly jwtService: JwtService,
    private readonly userSessionsService: UserSessionsService,
  ) {}

  async peopleRegister(data: PeopleRegisterDto) {
    const { email, fullname } = data;
    const savedUser = await this.peopleService.createUser({ ...data });
    const emailVerificationToken = generateLongToken();
    const tokenExpires = new Date(new Date().getTime() + 5 * 60 * 1000); //5 minutes
    const { language, id: userId } = savedUser;

    await this.userTokenService.saveUserToken({
      userId,
      token: emailVerificationToken,
      tokenExpires,
      type: TOKEN_TYPES.EMAILVERIFICATION,
      userType: USER_MODELS.PEOPLE,
    });
    const tokens = await this.getTokens({
      email,
      id: userId,
      name: fullname,
      type: USER_MODELS.PEOPLE,
    });
    const emailVerificationlink = `${appConfig().enterpriselink}/verify/${emailVerificationToken}`;
    return {
      message: 'Registration successful',
      tokens,
      user: savedUser,
    };
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
}
