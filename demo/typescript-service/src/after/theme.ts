// Theme service - separated concerns
export interface ThemeService {
  applyTheme(userId: string, theme: string): void;
}

export class ConsoleThemeService implements ThemeService {
  applyTheme(userId: string, theme: string): void {
    if (theme === 'dark') {
      console.log(`Applying dark theme for user ${userId}`);
    } else if (theme === 'light') {
      console.log(`Applying light theme for user ${userId}`);
    }
  }
}
