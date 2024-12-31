import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ayana.rath15@ethereal.email',
        pass: 'bHesMVa6wbpgQw6Rum',
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetUrl = `https://localhost:3000/reset-password?token=${token}`;
    const mailOptions = {
      from: 'Auth-backend Service',
      to,
      subject: 'Password Reset',
      html: `
				<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
			`,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
