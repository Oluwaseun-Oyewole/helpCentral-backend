import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import appConfig from '../../shared/config/index.config';
import { AuthService } from './../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: appConfig().googleClientId,
      clientSecret: appConfig().googleSecret,
      callbackURL: appConfig().googleCallbackUrl,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;
    const user = this.authService.validateGoogleUser({
      email: emails[0].value,
      fullname: name.givenName + '' + name.familyName,
      password: '',
      gender: 'female',
    });
    done(null, user);
  }
}
