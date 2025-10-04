import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessJWTPayload } from '../auth.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWTSECRETKEY,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request & { token?: string },
    payload: AccessJWTPayload,
  ): Promise<AccessJWTPayload & { accessToken: string }> {
    const accessToken = req.get('authorization').replace('Bearer', '').trim();
    const userSessionPayload =
      await this.authService.verifyUserJWTToken(accessToken);
    if (!userSessionPayload) throw new ForbiddenException('Invalid Session');
    req.token = accessToken;
    return {
      ...payload,
      accessToken,
    };
  }
}
