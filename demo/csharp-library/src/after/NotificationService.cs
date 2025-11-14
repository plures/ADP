// Notification service - separated concerns
using System;
using System.IO;

namespace UserManagement.Services
{
    public interface INotificationService
    {
        void SendEmail(string email, string message);
        void SendSMS(string phone, string message);
    }

    public class LoggingNotificationService : INotificationService
    {
        private readonly string logFile;

        public LoggingNotificationService(string logFile)
        {
            this.logFile = logFile;
        }

        public void SendEmail(string email, string message)
        {
            Console.WriteLine($"Sending email to {email}: {message}");
            File.AppendAllText(logFile, $"Email sent to {email}\n");
        }

        public void SendSMS(string phone, string message)
        {
            Console.WriteLine($"Sending SMS to {phone}: {message}");
            File.AppendAllText(logFile, $"SMS sent to {phone}\n");
        }
    }
}
