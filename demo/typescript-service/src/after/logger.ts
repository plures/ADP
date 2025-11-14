// Logging service - separated concerns
import * as fs from 'fs';

export interface Logger {
  log(message: string): void;
  logAudit(message: string): void;
  logAnalytics(data: any): void;
}

export class FileLogger implements Logger {
  constructor(
    private logFile: string,
    private auditFile: string,
    private analyticsFile: string
  ) {}

  log(message: string): void {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(this.logFile, `${timestamp} - ${message}\n`);
  }

  logAudit(message: string): void {
    fs.appendFileSync(this.auditFile, `${message}\n`);
  }

  logAnalytics(data: any): void {
    fs.appendFileSync(this.analyticsFile, `${JSON.stringify(data)}\n`);
  }
}
