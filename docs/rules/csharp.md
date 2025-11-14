# ADP Rule Catalog - C#

**Version:** 1.0.0  
**Last Updated:** 2024-11-12

This document describes architectural discipline rules for C# codebases.

## Overview

ADP analyzes C# source files (.cs) to ensure maintainable, well-structured code following Microsoft's design guidelines and industry best practices.

## C#-Specific Considerations

- Object-oriented design principles (SOLID)
- Interface-based programming
- Property and method conventions
- LINQ and functional patterns
- Async/await patterns

---

## Size Rules

### `max-lines`

**Thresholds for C#:**

| File Type | Expected Range | Description |
|-----------|----------------|-------------|
| Class | 100-500 lines | Complete class with methods |
| Interface | 10-100 lines | Interface definitions |
| Model/Entity | 20-200 lines | Data models, POCOs |
| Service | 150-600 lines | Business logic services |
| Controller | 100-400 lines | API controllers |
| Test Class | 100-800 lines | Unit test suites |

**Example Violation:**

```csharp
// ❌ BAD: 800-line "God Class"
public class UserManager
{
    // 100+ lines: User CRUD
    // 100+ lines: Authentication
    // 100+ lines: Authorization
    // 100+ lines: Email notifications
    // 100+ lines: Audit logging
    // 100+ lines: Report generation
    // 200+ lines: Business rules
}
```

**Recommended Fix:**

```csharp
// ✅ GOOD: Separated into focused classes
public class UserRepository { /* 150 lines: CRUD only */ }
public class AuthenticationService { /* 120 lines: Auth only */ }
public class AuthorizationService { /* 100 lines: Authz only */ }
public class NotificationService { /* 80 lines: Notifications */ }
public class AuditLogger { /* 60 lines: Logging */ }
public class UserReportGenerator { /* 120 lines: Reports */ }
public class UserBusinessRules { /* 200 lines: Business logic */ }
```

---

## Complexity Rules

### `max-complexity`

**C# Complexity Sources:**
- if/else statements
- switch/case statements
- while/do-while loops
- for/foreach loops
- catch blocks
- ternary operators (?:)
- null-coalescing operators (??, ??=)
- LINQ query expressions
- Pattern matching

**Thresholds:**

| Class Type | Complexity Threshold |
|------------|---------------------|
| Model/POCO | 3 |
| Repository | 8 |
| Service | 12 |
| Controller | 10 |
| Utility | 6 |

**Example Violation:**

```csharp
// ❌ BAD: Complexity = 18
public decimal CalculatePrice(Order order, Customer customer)
{
    decimal price = 0;
    
    if (order != null)
    {
        if (order.Items != null && order.Items.Any())
        {
            foreach (var item in order.Items)
            {
                if (item.Product != null)
                {
                    price += item.Product.Price * item.Quantity;
                    
                    if (item.Product.IsOnSale)
                    {
                        if (customer.IsPremium)
                        {
                            price -= price * 0.25m;
                        }
                        else if (customer.YearsActive > 5)
                        {
                            price -= price * 0.20m;
                        }
                        else if (customer.YearsActive > 2)
                        {
                            price -= price * 0.15m;
                        }
                        else
                        {
                            price -= price * 0.10m;
                        }
                    }
                }
            }
        }
        
        if (order.Total > 100)
        {
            price -= 10;
        }
    }
    
    return price;
}
```

**Recommended Fix:**

```csharp
// ✅ GOOD: Complexity = 4 per method
public decimal CalculatePrice(Order order, Customer customer)
{
    if (order?.Items == null || !order.Items.Any())
        return 0;
    
    var subtotal = order.Items.Sum(item => CalculateItemPrice(item, customer));
    var discount = CalculateOrderDiscount(order);
    
    return Math.Max(0, subtotal - discount);
}

private decimal CalculateItemPrice(OrderItem item, Customer customer)
{
    if (item?.Product == null) return 0;
    
    var basePrice = item.Product.Price * item.Quantity;
    var discount = item.Product.IsOnSale 
        ? GetSaleDiscount(customer) 
        : 0;
    
    return basePrice * (1 - discount);
}

private decimal GetSaleDiscount(Customer customer)
{
    if (customer.IsPremium) return 0.25m;
    if (customer.YearsActive > 5) return 0.20m;
    if (customer.YearsActive > 2) return 0.15m;
    return 0.10m;
}

private decimal CalculateOrderDiscount(Order order)
{
    return order.Total > 100 ? 10 : 0;
}
```

---

## C# Best Practices

### `interface-segregation`

**Rule ID:** `interface-segregation`  
**Category:** SOLID Principles  
**Severity:** Warning  
**Autofix:** Not available

**Description:**  
Interfaces should be focused and not force implementations to depend on methods they don't use.

**Example Violation:**

```csharp
// ❌ BAD: Fat interface
public interface IUserService
{
    void CreateUser(User user);
    void DeleteUser(int id);
    void UpdateUser(User user);
    User GetUser(int id);
    List<User> GetAllUsers();
    void SendWelcomeEmail(int userId);
    void GenerateUserReport(int userId);
    void ExportUsersToExcel();
    void ImportUsersFromCsv(string path);
    void CalculateUserStatistics();
}
```

**Recommended Fix:**

```csharp
// ✅ GOOD: Segregated interfaces
public interface IUserRepository
{
    void Create(User user);
    void Delete(int id);
    void Update(User user);
    User GetById(int id);
    IEnumerable<User> GetAll();
}

public interface IUserNotificationService
{
    void SendWelcomeEmail(int userId);
}

public interface IUserReportService
{
    void GenerateReport(int userId);
    void ExportToExcel();
}

public interface IUserImportService
{
    void ImportFromCsv(string path);
}

public interface IUserAnalyticsService
{
    UserStatistics CalculateStatistics();
}
```

---

### `async-naming-convention`

**Rule ID:** `async-naming-convention`  
**Category:** Naming  
**Severity:** Informational  
**Autofix:** Available

**Description:**  
Async methods should be suffixed with "Async" to indicate asynchronous behavior.

**Example Violation:**

```csharp
// ❌ BAD: Missing Async suffix
public async Task<User> GetUser(int id)
{
    return await _repository.FindAsync(id);
}
```

**Recommended Fix:**

```csharp
// ✅ GOOD: Async suffix
public async Task<User> GetUserAsync(int id)
{
    return await _repository.FindAsync(id);
}
```

---

### `dispose-pattern`

**Rule ID:** `dispose-pattern`  
**Category:** Resource Management  
**Severity:** Error  
**Autofix:** Not available

**Description:**  
Classes managing unmanaged resources should implement IDisposable pattern correctly.

**Example Violation:**

```csharp
// ❌ BAD: Missing disposal
public class FileLogger
{
    private StreamWriter _writer;
    
    public FileLogger(string path)
    {
        _writer = new StreamWriter(path);
    }
    
    public void Log(string message)
    {
        _writer.WriteLine(message);
    }
    // _writer is never disposed!
}
```

**Recommended Fix:**

```csharp
// ✅ GOOD: Proper IDisposable pattern
public class FileLogger : IDisposable
{
    private StreamWriter _writer;
    private bool _disposed;
    
    public FileLogger(string path)
    {
        _writer = new StreamWriter(path);
    }
    
    public void Log(string message)
    {
        if (_disposed)
            throw new ObjectDisposedException(nameof(FileLogger));
        
        _writer.WriteLine(message);
    }
    
    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }
    
    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                _writer?.Dispose();
            }
            _disposed = true;
        }
    }
    
    ~FileLogger()
    {
        Dispose(false);
    }
}

// Or use using statement:
public class SimpleLogger : IDisposable
{
    private readonly StreamWriter _writer;
    
    public SimpleLogger(string path)
    {
        _writer = new StreamWriter(path);
    }
    
    public void Dispose()
    {
        _writer?.Dispose();
    }
}
```

---

### `null-reference-safety`

**Rule ID:** `null-reference-safety`  
**Category:** Safety  
**Severity:** Warning  
**Autofix:** Partial

**Description:**  
Use nullable reference types and null-conditional operators to prevent NullReferenceException.

**Example Violation:**

```csharp
// ❌ BAD: Potential null reference
public string GetUserEmail(User user)
{
    return user.Email.ToLower();  // May throw if user or Email is null
}
```

**Recommended Fix:**

```csharp
// ✅ GOOD: Null-safe access
public string? GetUserEmail(User? user)
{
    return user?.Email?.ToLower();
}

// Or with explicit checks:
public string GetUserEmail(User user)
{
    if (user == null)
        throw new ArgumentNullException(nameof(user));
    
    if (string.IsNullOrEmpty(user.Email))
        throw new InvalidOperationException("User email is not set");
    
    return user.Email.ToLower();
}
```

---

## Configuration

```json
{
  "architectural-discipline": {
    "languages": {
      "csharp": {
        "maxLines": 400,
        "maxComplexity": 12,
        "maxLinesPerFunction": 60,
        "enforceAsyncNaming": true,
        "enforceDisposablePattern": true
      }
    }
  }
}
```

## SOLID Principles in C#

ADP helps enforce SOLID principles:

1. **Single Responsibility** - Classes should have one reason to change
2. **Open/Closed** - Open for extension, closed for modification
3. **Liskov Substitution** - Derived classes must be substitutable for base classes
4. **Interface Segregation** - Many specific interfaces better than one general
5. **Dependency Inversion** - Depend on abstractions, not concretions

## References

- [C# Coding Conventions](https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions)
- [Framework Design Guidelines](https://docs.microsoft.com/en-us/dotnet/standard/design-guidelines/)
- [Clean Code C#](https://github.com/thangchung/clean-code-dotnet)
