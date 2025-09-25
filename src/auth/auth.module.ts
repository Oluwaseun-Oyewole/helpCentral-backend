import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PeopleModule } from 'src/people/people.module';
import { UserSessionsModule } from 'src/user-sessions/user-sessions.module';
import { UserTokensModule } from 'src/user-tokens/user-tokens.module';
import appConfig from '../shared/config/index.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    PeopleModule,
    JwtModule.register({
      secret: appConfig().jwtsecretkey,
    }),
    PassportModule,
    UserSessionsModule,
    UserTokensModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, GoogleStrategy],
})
export class AuthModule {}
