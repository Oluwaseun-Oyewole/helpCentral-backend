import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserToken, UserTokenSchema } from './schema/user-token.schema';
import { UserTokenRepository } from './user-token.repository';
import { UserTokensService } from './user-tokens.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserToken.name, schema: UserTokenSchema },
    ]),
  ],
  providers: [UserTokensService, UserTokenRepository],
  exports: [UserTokensService],
})
export class UserTokensModule {}
