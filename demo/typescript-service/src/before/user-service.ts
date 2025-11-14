// This file intentionally violates architectural discipline rules
// to demonstrate the analyze → recommend → fix workflow

import * as fs from 'fs';
import * as path from 'path';

// Violation 1: Function too long (>50 lines)
// Violation 2: High cyclomatic complexity (>10)
// Violation 3: Too many side effects (low purity score)
export class UserService {
  private users: Map<string, any> = new Map();
  private logFile = './user-service.log';

  async processUser(userData: any): Promise<void> {
    // Complex conditional logic with deep nesting
    if (userData) {
      if (userData.id) {
        if (userData.name) {
          if (userData.email) {
            if (userData.email.includes('@')) {
              if (userData.age) {
                if (userData.age > 0 && userData.age < 150) {
                  if (userData.role) {
                    if (userData.role === 'admin' || userData.role === 'user' || userData.role === 'moderator') {
                      // Side effect: File I/O
                      const timestamp = new Date().toISOString();
                      fs.appendFileSync(this.logFile, `${timestamp} - Processing user ${userData.id}\n`);
                      
                      // Side effect: Database operation
                      this.users.set(userData.id, userData);
                      
                      // More nested logic
                      if (userData.preferences) {
                        if (userData.preferences.notifications) {
                          if (userData.preferences.notifications.email) {
                            // Send email notification
                            this.sendEmail(userData.email, 'Welcome!');
                          }
                          if (userData.preferences.notifications.sms) {
                            // Send SMS notification
                            this.sendSMS(userData.phone, 'Welcome!');
                          }
                        }
                        if (userData.preferences.theme) {
                          if (userData.preferences.theme === 'dark') {
                            this.applyDarkTheme(userData.id);
                          } else if (userData.preferences.theme === 'light') {
                            this.applyLightTheme(userData.id);
                          }
                        }
                      }
                      
                      // Audit logging
                      if (userData.role === 'admin') {
                        fs.appendFileSync('./audit.log', `Admin user created: ${userData.id}\n`);
                      }
                      
                      // Analytics
                      this.trackUserCreation(userData);
                      
                      console.log(`User ${userData.id} processed successfully`);
                    } else {
                      throw new Error('Invalid role');
                    }
                  } else {
                    throw new Error('Role is required');
                  }
                } else {
                  throw new Error('Invalid age');
                }
              } else {
                throw new Error('Age is required');
              }
            } else {
              throw new Error('Invalid email format');
            }
          } else {
            throw new Error('Email is required');
          }
        } else {
          throw new Error('Name is required');
        }
      } else {
        throw new Error('ID is required');
      }
    } else {
      throw new Error('User data is required');
    }
  }

  // Additional methods with issues
  private sendEmail(email: string, message: string): void {
    console.log(`Sending email to ${email}: ${message}`);
    fs.appendFileSync(this.logFile, `Email sent to ${email}\n`);
  }

  private sendSMS(phone: string, message: string): void {
    console.log(`Sending SMS to ${phone}: ${message}`);
    fs.appendFileSync(this.logFile, `SMS sent to ${phone}\n`);
  }

  private applyDarkTheme(userId: string): void {
    console.log(`Applying dark theme for user ${userId}`);
  }

  private applyLightTheme(userId: string): void {
    console.log(`Applying light theme for user ${userId}`);
  }

  private trackUserCreation(userData: any): void {
    fs.appendFileSync('./analytics.log', `User created: ${JSON.stringify(userData)}\n`);
  }

  // Another violation: Complex method with multiple responsibilities
  public generateReport(startDate: Date, endDate: Date): string {
    let report = '';
    const users = Array.from(this.users.values());
    
    for (const user of users) {
      if (user.createdAt >= startDate && user.createdAt <= endDate) {
        report += `User: ${user.name}\n`;
        report += `Email: ${user.email}\n`;
        report += `Role: ${user.role}\n`;
        
        if (user.lastLogin) {
          const daysSinceLogin = Math.floor((Date.now() - user.lastLogin.getTime()) / (1000 * 60 * 60 * 24));
          if (daysSinceLogin > 30) {
            report += `Status: Inactive (${daysSinceLogin} days)\n`;
          } else if (daysSinceLogin > 7) {
            report += `Status: Low Activity (${daysSinceLogin} days)\n`;
          } else {
            report += `Status: Active\n`;
          }
        }
        
        if (user.purchases) {
          const totalSpent = user.purchases.reduce((sum: number, p: any) => sum + p.amount, 0);
          report += `Total Spent: $${totalSpent}\n`;
          
          if (totalSpent > 1000) {
            report += `Tier: Gold\n`;
          } else if (totalSpent > 500) {
            report += `Tier: Silver\n`;
          } else {
            report += `Tier: Bronze\n`;
          }
        }
        
        report += '\n---\n\n';
      }
    }
    
    fs.writeFileSync('./report.txt', report);
    return report;
  }
}
