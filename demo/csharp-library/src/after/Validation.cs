// Validation utilities - pure functions
using System;

namespace UserManagement.Validation
{
    public static class UserValidator
    {
        public static void ValidateId(string id)
        {
            if (string.IsNullOrEmpty(id))
                throw new ArgumentException("ID is required");
        }

        public static void ValidateName(string name)
        {
            if (string.IsNullOrEmpty(name))
                throw new ArgumentException("Name is required");
        }

        public static void ValidateEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
                throw new ArgumentException("Email is required");
            if (!email.Contains("@"))
                throw new ArgumentException("Invalid email format");
        }

        public static void ValidateAge(int age)
        {
            if (age <= 0 || age >= 150)
                throw new ArgumentException("Age must be between 1 and 149");
        }

        public static void ValidateRole(string role)
        {
            if (string.IsNullOrEmpty(role))
                throw new ArgumentException("Role is required");
            
            var validRoles = new[] { "Admin", "User", "Moderator" };
            if (Array.IndexOf(validRoles, role) == -1)
                throw new ArgumentException($"Invalid role: {role}");
        }

        public static void ValidateUser(User user)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));
            
            ValidateId(user.Id);
            ValidateName(user.Name);
            ValidateEmail(user.Email);
            ValidateAge(user.Age);
            ValidateRole(user.Role);
        }
    }
}
