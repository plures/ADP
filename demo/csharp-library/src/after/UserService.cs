// Refactored UserService with improved architecture
using System;
using System.Collections.Generic;
using System.IO;
using UserManagement.Validation;
using UserManagement.Services;

namespace UserManagement
{
    public class UserService
    {
        private readonly Dictionary<string, User> users = new Dictionary<string, User>();
        private readonly ILogger logger;
        private readonly INotificationService notificationService;
        private readonly IThemeService themeService;

        public UserService(
            ILogger logger,
            INotificationService notificationService,
            IThemeService themeService)
        {
            this.logger = logger;
            this.notificationService = notificationService;
            this.themeService = themeService;
        }

        public void ProcessUser(User userData)
        {
            // Early validation with clear error messages
            UserValidator.ValidateUser(userData);
            
            // Log the operation
            logger.Log($"Processing user {userData.Id}");
            
            // Store user
            users[userData.Id] = userData;
            
            // Handle notifications
            HandleNotifications(userData);
            
            // Handle theme preferences
            HandleThemePreferences(userData);
            
            // Audit logging for admin users
            if (userData.Role == "Admin")
            {
                logger.LogAudit($"Admin user created: {userData.Id}");
            }
            
            // Track analytics
            logger.LogAnalytics($"User created: {userData.Id}");
            
            Console.WriteLine($"User {userData.Id} processed successfully");
        }

        private void HandleNotifications(User userData)
        {
            if (userData.Preferences?.Notifications == null) return;
            
            var notifications = userData.Preferences.Notifications;
            
            if (notifications.Email)
            {
                notificationService.SendEmail(userData.Email, "Welcome!");
            }
            
            if (notifications.SMS && !string.IsNullOrEmpty(userData.Phone))
            {
                notificationService.SendSMS(userData.Phone, "Welcome!");
            }
        }

        private void HandleThemePreferences(User userData)
        {
            var theme = userData.Preferences?.Theme;
            if (!string.IsNullOrEmpty(theme))
            {
                themeService.ApplyTheme(userData.Id, theme);
            }
        }

        public User GetUser(string id) => users.TryGetValue(id, out var user) ? user : null;

        public IEnumerable<User> GetAllUsers() => users.Values;
    }

    // Logger interface
    public interface ILogger
    {
        void Log(string message);
        void LogAudit(string message);
        void LogAnalytics(string data);
    }

    // Theme service interface
    public interface IThemeService
    {
        void ApplyTheme(string userId, string theme);
    }
}
