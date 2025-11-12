// C# Demo - Before Refactoring
// This file intentionally violates architectural discipline rules

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace UserManagement
{
    // Violation 1: Class too large with too many responsibilities
    // Violation 2: High cyclomatic complexity
    // Violation 3: Deep nesting and many side effects
    public class UserService
    {
        private Dictionary<string, User> users = new Dictionary<string, User>();
        private string logFile = "./user-service.log";

        public void ProcessUser(User userData)
        {
            // Deep nesting with complex conditional logic
            if (userData != null)
            {
                if (!string.IsNullOrEmpty(userData.Id))
                {
                    if (!string.IsNullOrEmpty(userData.Name))
                    {
                        if (!string.IsNullOrEmpty(userData.Email))
                        {
                            if (userData.Email.Contains("@"))
                            {
                                if (userData.Age > 0)
                                {
                                    if (userData.Age < 150)
                                    {
                                        if (!string.IsNullOrEmpty(userData.Role))
                                        {
                                            if (userData.Role == "Admin" || userData.Role == "User" || userData.Role == "Moderator")
                                            {
                                                // Side effect: File I/O
                                                var timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                                                File.AppendAllText(logFile, $"{timestamp} - Processing user {userData.Id}\n");
                                                
                                                // Side effect: Database operation
                                                users[userData.Id] = userData;
                                                
                                                // More nested logic
                                                if (userData.Preferences != null)
                                                {
                                                    if (userData.Preferences.Notifications != null)
                                                    {
                                                        if (userData.Preferences.Notifications.Email)
                                                        {
                                                            SendEmail(userData.Email, "Welcome!");
                                                        }
                                                        if (userData.Preferences.Notifications.SMS)
                                                        {
                                                            SendSMS(userData.Phone, "Welcome!");
                                                        }
                                                    }
                                                    
                                                    if (userData.Preferences.Theme != null)
                                                    {
                                                        if (userData.Preferences.Theme == "Dark")
                                                        {
                                                            ApplyDarkTheme(userData.Id);
                                                        }
                                                        else if (userData.Preferences.Theme == "Light")
                                                        {
                                                            ApplyLightTheme(userData.Id);
                                                        }
                                                    }
                                                }
                                                
                                                // Audit logging
                                                if (userData.Role == "Admin")
                                                {
                                                    File.AppendAllText("./audit.log", $"Admin user created: {userData.Id}\n");
                                                }
                                                
                                                // Analytics
                                                TrackUserCreation(userData);
                                                
                                                Console.WriteLine($"User {userData.Id} processed successfully");
                                            }
                                            else
                                            {
                                                throw new ArgumentException("Invalid role");
                                            }
                                        }
                                        else
                                        {
                                            throw new ArgumentException("Role is required");
                                        }
                                    }
                                    else
                                    {
                                        throw new ArgumentException("Invalid age");
                                    }
                                }
                                else
                                {
                                    throw new ArgumentException("Age is required");
                                }
                            }
                            else
                            {
                                throw new ArgumentException("Invalid email format");
                            }
                        }
                        else
                        {
                            throw new ArgumentException("Email is required");
                        }
                    }
                    else
                    {
                        throw new ArgumentException("Name is required");
                    }
                }
                else
                {
                    throw new ArgumentException("ID is required");
                }
            }
            else
            {
                throw new ArgumentNullException(nameof(userData));
            }
        }

        private void SendEmail(string email, string message)
        {
            Console.WriteLine($"Sending email to {email}: {message}");
            File.AppendAllText(logFile, $"Email sent to {email}\n");
        }

        private void SendSMS(string phone, string message)
        {
            Console.WriteLine($"Sending SMS to {phone}: {message}");
            File.AppendAllText(logFile, $"SMS sent to {phone}\n");
        }

        private void ApplyDarkTheme(string userId)
        {
            Console.WriteLine($"Applying dark theme for user {userId}");
        }

        private void ApplyLightTheme(string userId)
        {
            Console.WriteLine($"Applying light theme for user {userId}");
        }

        private void TrackUserCreation(User userData)
        {
            File.AppendAllText("./analytics.log", $"User created: {userData.Id}\n");
        }

        // Another complex method with multiple responsibilities
        public string GenerateReport(DateTime startDate, DateTime endDate)
        {
            var report = new System.Text.StringBuilder();
            
            foreach (var user in users.Values)
            {
                if (user.CreatedAt >= startDate && user.CreatedAt <= endDate)
                {
                    report.AppendLine($"User: {user.Name}");
                    report.AppendLine($"Email: {user.Email}");
                    report.AppendLine($"Role: {user.Role}");
                    
                    if (user.LastLogin.HasValue)
                    {
                        var daysSinceLogin = (DateTime.Now - user.LastLogin.Value).Days;
                        if (daysSinceLogin > 30)
                        {
                            report.AppendLine($"Status: Inactive ({daysSinceLogin} days)");
                        }
                        else if (daysSinceLogin > 7)
                        {
                            report.AppendLine($"Status: Low Activity ({daysSinceLogin} days)");
                        }
                        else
                        {
                            report.AppendLine("Status: Active");
                        }
                    }
                    
                    if (user.Purchases != null && user.Purchases.Any())
                    {
                        var totalSpent = user.Purchases.Sum(p => p.Amount);
                        report.AppendLine($"Total Spent: ${totalSpent}");
                        
                        if (totalSpent > 1000)
                        {
                            report.AppendLine("Tier: Gold");
                        }
                        else if (totalSpent > 500)
                        {
                            report.AppendLine("Tier: Silver");
                        }
                        else
                        {
                            report.AppendLine("Tier: Bronze");
                        }
                    }
                    
                    report.AppendLine("\n---\n");
                }
            }
            
            var reportText = report.ToString();
            File.WriteAllText("./report.txt", reportText);
            return reportText;
        }
    }

    public class User
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int Age { get; set; }
        public string Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLogin { get; set; }
        public UserPreferences Preferences { get; set; }
        public List<Purchase> Purchases { get; set; }
    }

    public class UserPreferences
    {
        public NotificationPreferences Notifications { get; set; }
        public string Theme { get; set; }
    }

    public class NotificationPreferences
    {
        public bool Email { get; set; }
        public bool SMS { get; set; }
    }

    public class Purchase
    {
        public decimal Amount { get; set; }
    }
}
