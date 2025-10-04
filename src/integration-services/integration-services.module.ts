import { Module } from '@nestjs/common';
import { Resend } from 'resend';
import { MailService } from './mail/mail-service';

@Module({
  providers: [
    MailService,
    {
      provide: 'RESEND_CLIENT',
      useFactory: () => new Resend(process.env.RESEND_API_KEY),
    },
  ],
  exports: [MailService, 'RESEND_CLIENT'],
})
export class IntegrationServicesModule {}
