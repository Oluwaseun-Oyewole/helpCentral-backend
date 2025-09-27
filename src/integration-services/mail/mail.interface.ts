import appConfig from '../../shared/config/index.config';

export const emailConfig = () => ({
  host: appConfig().SMTP_HOST,
  port: appConfig().SMTP_PORT,
  secure: true,
  auth: {
    user: appConfig().SMTP_USER,
    pass: appConfig().SMTP_PASS,
  },
  from: appConfig().SMTP_FROM,
});

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
  body?: string;
}

export interface EmailData {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}
