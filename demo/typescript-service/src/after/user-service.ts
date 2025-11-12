// Refactored UserService with improved architecture
import { validateUserData } from './validation.js';
import { NotificationService } from './notifications.js';
import { ThemeService } from './theme.js';
import { Logger } from './logger.js';

export class UserService {
  private users: Map<string, any> = new Map();

  constructor(
    private logger: Logger,
    private notificationService: NotificationService,
    private themeService: ThemeService
  ) {}

  async processUser(userData: any): Promise<void> {
    // Early validation with clear error messages
    validateUserData(userData);
    
    // Log the operation
    this.logger.log(`Processing user ${userData.id}`);
    
    // Store user
    this.users.set(userData.id, userData);
    
    // Handle notifications if preferences exist
    this.handleNotifications(userData);
    
    // Handle theme preferences
    this.handleThemePreferences(userData);
    
    // Audit logging for admin users
    if (userData.role === 'admin') {
      this.logger.logAudit(`Admin user created: ${userData.id}`);
    }
    
    // Track analytics
    this.logger.logAnalytics(userData);
    
    console.log(`User ${userData.id} processed successfully`);
  }

  private handleNotifications(userData: any): void {
    if (!userData.preferences?.notifications) return;
    
    const { notifications } = userData.preferences;
    
    if (notifications.email) {
      this.notificationService.sendEmail(userData.email, 'Welcome!');
    }
    
    if (notifications.sms && userData.phone) {
      this.notificationService.sendSMS(userData.phone, 'Welcome!');
    }
  }

  private handleThemePreferences(userData: any): void {
    const theme = userData.preferences?.theme;
    if (theme) {
      this.themeService.applyTheme(userData.id, theme);
    }
  }

  public getUser(id: string): any | undefined {
    return this.users.get(id);
  }

  public getAllUsers(): any[] {
    return Array.from(this.users.values());
  }
}
