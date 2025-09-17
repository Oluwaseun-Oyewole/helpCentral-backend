import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSession, UserSessionSchema } from './schemas/user-session.schema';
import { UserSessionRepository } from './user-sessions.repository';
import { UserSessionsService } from './user-sessions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSession.name, schema: UserSessionSchema },
    ]),
  ],

  providers: [UserSessionsService, UserSessionRepository],
  exports: [UserSessionsService],
})
export class UserSessionsModule {}
