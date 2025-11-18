import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { PasswordHashService } from './password-hash.service';

@Module({
  providers: [EmailService, PasswordHashService],
  exports: [EmailService, PasswordHashService],
})
export class UtilsModule {}
