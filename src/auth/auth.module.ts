import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PeopleModule } from 'src/people/people.module';
import { UserSessionsModule } from 'src/user-sessions/user-sessions.module';
import { UserTokensModule } from 'src/user-tokens/user-tokens.module';
import appConfig from '../shared/config/index.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from './schema/auth.schema';

@Module({
  imports: [
    PeopleModule,
    JwtModule.register({
      secret: appConfig().jwtsecretkey,
      // signOptions: { expiresIn: '7d' },
      // verifyOptions: { maxAge: '777d' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserSessionsModule,
    UserTokensModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
