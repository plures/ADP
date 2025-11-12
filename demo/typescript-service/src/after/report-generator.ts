// Report generation - separated from UserService
import * as fs from 'fs';

interface UserTier {
  name: string;
  minSpend: number;
}

const TIERS: UserTier[] = [
  { name: 'Gold', minSpend: 1000 },
  { name: 'Silver', minSpend: 500 },
  { name: 'Bronze', minSpend: 0 }
];

export class ReportGenerator {
  generateUserReport(users: any[], startDate: Date, endDate: Date): string {
    const filteredUsers = this.filterUsersByDate(users, startDate, endDate);
    const reportLines = filteredUsers.map(user => this.formatUserReport(user));
    const report = reportLines.join('\n---\n\n');
    
    fs.writeFileSync('./report.txt', report);
    return report;
  }

  private filterUsersByDate(users: any[], startDate: Date, endDate: Date): any[] {
    return users.filter(user => 
      user.createdAt >= startDate && user.createdAt <= endDate
    );
  }

  private formatUserReport(user: any): string {
    const lines = [
      `User: ${user.name}`,
      `Email: ${user.email}`,
      `Role: ${user.role}`
    ];

    const activityStatus = this.calculateActivityStatus(user.lastLogin);
    if (activityStatus) {
      lines.push(activityStatus);
    }

    const tierInfo = this.calculateTierInfo(user.purchases);
    if (tierInfo) {
      lines.push(tierInfo.spending);
      lines.push(tierInfo.tier);
    }

    return lines.join('\n');
  }

  private calculateActivityStatus(lastLogin?: Date): string | null {
    if (!lastLogin) return null;

    const daysSinceLogin = Math.floor(
      (Date.now() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLogin > 30) {
      return `Status: Inactive (${daysSinceLogin} days)`;
    }
    if (daysSinceLogin > 7) {
      return `Status: Low Activity (${daysSinceLogin} days)`;
    }
    return `Status: Active`;
  }

  private calculateTierInfo(purchases?: any[]): { spending: string; tier: string } | null {
    if (!purchases) return null;

    const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);
    const tier = this.getTierForSpending(totalSpent);

    return {
      spending: `Total Spent: $${totalSpent}`,
      tier: `Tier: ${tier}`
    };
  }

  private getTierForSpending(amount: number): string {
    const tier = TIERS.find(t => amount >= t.minSpend);
    return tier?.name || 'Bronze';
  }
}
