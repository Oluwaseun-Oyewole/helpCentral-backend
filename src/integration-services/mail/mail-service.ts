import { Inject, Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { SendRegisterEmailDto } from './dto/mail.dto';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

@Injectable()
export class MailService {
  constructor(@Inject('RESEND_CLIENT') private readonly resend: Resend) {}

  async sendRegistrationEmail(input: SendRegisterEmailDto) {
    const mailOptions = {
      from: 'onboarding@resend.dev',
      to: input.to,
      subject: 'Event Registration successful',
      html: `
      <div>
        <p>Hello ${input.name},</p>
        <p>Welcome onboard.</p>
        <p>Please verify your account with this link: <b>${input.link}</b></p>
      </div>
      `,
    };
    return await this.resend.emails.send(mailOptions);
  }
}
