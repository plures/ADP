// Notification service - separated concerns
import * as fs from 'fs';

export interface NotificationService {
  sendEmail(email: string, message: string): void;
  sendSMS(phone: string, message: string): void;
}

export class LoggingNotificationService implements NotificationService {
  constructor(private logFile: string) {}

  sendEmail(email: string, message: string): void {
    console.log(`Sending email to ${email}: ${message}`);
    fs.appendFileSync(this.logFile, `Email sent to ${email}\n`);
  }

  sendSMS(phone: string, message: string): void {
    console.log(`Sending SMS to ${phone}: ${message}`);
    fs.appendFileSync(this.logFile, `SMS sent to ${phone}\n`);
  }
}
