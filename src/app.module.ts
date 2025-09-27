import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PeopleModule } from './people/people.module';
import appConfig from './shared/config/index.config';
import { SponsorsModule } from './sponsors/sponsors.module';
import { UserSessionsModule } from './user-sessions/user-sessions.module';
import { UserTokensModule } from './user-tokens/user-tokens.module';
import { IntegrationServicesModule } from './integration-services/integration-services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [appConfig],
    }),
    MongooseModule.forRoot(appConfig().database.uri, {
      dbName: appConfig().database.name,
    }),
    PeopleModule,
    SponsorsModule,
    AuthModule,
    UserSessionsModule,
    UserTokensModule,
    IntegrationServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
