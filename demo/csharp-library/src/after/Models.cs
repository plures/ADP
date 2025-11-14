// Model definitions
using System;
using System.Collections.Generic;

namespace UserManagement
{
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
