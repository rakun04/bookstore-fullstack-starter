import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendPasswordResetEmail(email: string, name: string, token: string): Promise<void> {
    // Email sending implementation
    console.log(`Sending password reset email to ${email} (${name}) with token ${token}`);
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    // Email sending implementation
    console.log(`Sending verification email to ${email} with token ${token}`);
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    // Email sending implementation
    console.log(`Sending welcome email to ${email} (${name})`);
  }

  async sendPasswordResetConfirmationEmail(email: string, name: string): Promise<void> {
    // Email sending implementation
    console.log(`Sending password reset confirmation email to ${email} (${name})`);
  }
}
