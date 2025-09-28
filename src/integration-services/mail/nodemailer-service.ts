import { Injectable, Logger } from '@nestjs/common';
import * as handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';
import { signTemplate } from 'src/templates/signup';
import appConfig from '../../shared/config/index.config';
import { emailConfig, EmailData, EmailTemplate } from './mail.interface';

@Injectable()
export class NodemailerService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(NodemailerService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: appConfig().SMTP_HOST,
      port: 587,
      secure: false,
      auth: { user: appConfig().SMTP_USER, pass: appConfig().SMTP_PASS },
      //   connectionTimeout: 10000, // 10 seconds
      socketTimeout: 10000, // 10 seconds
      //       pool: true, // Enable connection pooling
      //       maxConnections: 5,
      //       maxMessages: 100,
      //       socketTimeout: 10000,
      //       rateLimit: 14,
    });

    this.verifyConnection();
  }

  async verifyConnection() {
    console.log('verifying...');
    try {
      await this.transporter.verify();
      console.log('verified successfully');
      this.logger.log('SMTP connection verified successfully');
    } catch (error) {
      console.log('failed');
      this.logger.error('SMTP connection verification failed:', error);
    }
  }

  async sendEmail(
    emailData: EmailData,
    template: EmailTemplate,
  ): Promise<void> {
    try {
      const mailOptions = {
        from: emailConfig().from,
        to: emailData.to,
        cc: emailData.cc,
        bcc: emailData.bcc,
        replyTo: emailData.replyTo,
        subject: template.subject,
        html: template.html,
        text: template.text,
        attachments: emailData.attachments,
        body: template.body,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
      this.logger.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendTemplateEmail(emailData: EmailData): Promise<void> {
    try {
      const template = await handlebars.compile(signTemplate);
      const htmlBody = await template({ name: 'Seun' });

      await this.sendEmail(emailData, {
        subject: '',
        html: htmlBody,
        text: '',
        // text: compiledText,
      });
    } catch (error) {
      this.logger.error('Failed to send template email:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.transporter) {
      this.transporter.close();
      this.logger.log('SMTP connection closed');
    }
  }
}
