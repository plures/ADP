// C# Example - User Service Implementation
// This demonstrates a typical C# service class with methods

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.IO;
using System.Net.Http;

namespace UserManagement
{
    public class UserService
    {
        private readonly HttpClient _httpClient;
        private readonly List<User> _users;

        public UserService(HttpClient httpClient)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _users = new List<User>();
        }

        public async Task<User> GetUserAsync(int userId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"api/users/{userId}");
                response.EnsureSuccessStatusCode();
                
                var user = await response.Content.ReadAsAsync<User>();
                return user;
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error fetching user: {ex.Message}");
                return null;
            }
        }

        public User CreateUser(string name, string email)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name cannot be empty", nameof(name));

            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be empty", nameof(email));

            var user = new User
            {
                Id = _users.Count + 1,
                Name = name,
                Email = email,
                CreatedAt = DateTime.UtcNow
            };

            _users.Add(user);
            return user;
        }

        public void SaveUsersToFile(string filePath)
        {
            var json = System.Text.Json.JsonSerializer.Serialize(_users);
            File.WriteAllText(filePath, json);
        }

        public IEnumerable<User> SearchUsers(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return _users;

            return _users.Where(u => 
                u.Name.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                u.Email.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)
            );
        }
    }

    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

