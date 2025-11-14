# ADP Rule Catalog - Rust

**Version:** 1.0.0  
**Last Updated:** 2024-11-12

This document describes architectural discipline rules for Rust codebases.

## Overview

ADP analyzes Rust source files (.rs) to ensure idiomatic, maintainable Rust code following community conventions and the Rust API guidelines.

## Rust-Specific Considerations

- Ownership and borrowing patterns
- Trait-based abstractions
- Error handling with Result and Option
- Zero-cost abstractions
- Cargo project structure

---

## Size Rules

### `max-lines`

**Thresholds for Rust:**

| File Type | Expected Range | Description |
|-----------|----------------|-------------|
| Module (lib.rs, mod.rs) | 100-500 lines | Module definitions |
| Binary (main.rs) | 50-300 lines | Application entry point |
| Regular Module | 100-400 lines | Implementation modules |
| Test Module | 100-600 lines | Test suites |
| Trait Definition | 20-150 lines | Trait declarations |

**Example Violation:**

```rust
// ❌ BAD: 600-line monolithic module
pub mod user {
    // 100+ lines: struct definitions
    // 150+ lines: implementation
    // 100+ lines: trait implementations
    // 100+ lines: helper functions
    // 150+ lines: tests
}
```

**Recommended Fix:**

```rust
// ✅ GOOD: Separated into focused modules
// user/mod.rs
pub mod models;      // 80 lines: struct definitions
pub mod repository;  // 120 lines: data access
pub mod service;     // 150 lines: business logic
pub mod validation;  // 70 lines: validation logic

// user/models.rs
pub struct User { /* model definition */ }

// user/repository.rs
pub struct UserRepository { /* data access */ }

// user/service.rs
pub struct UserService { /* business logic */ }
```

---

## Complexity Rules

### `max-complexity`

**Rust Complexity Sources:**
- if/else expressions
- match arms
- loop/while/for loops
- if let/while let patterns
- Pattern matching in function parameters
- Closure complexity
- Macro expansions

**Thresholds:**

| Code Type | Complexity Threshold |
|-----------|---------------------|
| Function | 10 |
| Method | 12 |
| Closure | 6 |
| Match Expression | 8 arms |

**Example Violation:**

```rust
// ❌ BAD: Complexity = 16
fn calculate_discount(user: &User, order: &Order) -> f64 {
    if user.is_premium {
        if order.total > 100.0 {
            if order.items.len() > 5 {
                0.20
            } else if order.items.len() > 3 {
                0.15
            } else {
                0.10
            }
        } else if order.total > 50.0 {
            0.10
        } else {
            0.05
        }
    } else {
        if order.total > 100.0 {
            0.10
        } else if order.total > 50.0 {
            0.05
        } else {
            0.0
        }
    }
}
```

**Recommended Fix:**

```rust
// ✅ GOOD: Complexity = 4, using Rust idioms
struct DiscountTier {
    min_total: f64,
    min_items: usize,
    rate: f64,
}

fn calculate_discount(user: &User, order: &Order) -> f64 {
    let tiers = if user.is_premium {
        PREMIUM_TIERS
    } else {
        REGULAR_TIERS
    };
    
    find_applicable_discount(order, tiers)
}

fn find_applicable_discount(order: &Order, tiers: &[DiscountTier]) -> f64 {
    tiers
        .iter()
        .find(|tier| {
            order.total >= tier.min_total && order.items.len() >= tier.min_items
        })
        .map(|tier| tier.rate)
        .unwrap_or(0.0)
}

const PREMIUM_TIERS: &[DiscountTier] = &[
    DiscountTier { min_total: 100.0, min_items: 5, rate: 0.20 },
    DiscountTier { min_total: 100.0, min_items: 3, rate: 0.15 },
    DiscountTier { min_total: 100.0, min_items: 0, rate: 0.10 },
    DiscountTier { min_total: 50.0, min_items: 0, rate: 0.10 },
];
```

---

## Rust Best Practices

### `error-handling-idioms`

**Rule ID:** `error-handling-idioms`  
**Category:** Idioms  
**Severity:** Warning  
**Autofix:** Not available

**Description:**  
Use Result and Option types appropriately. Avoid panics in library code.

**Example Violation:**

```rust
// ❌ BAD: Panics instead of returning Result
pub fn get_user(id: u32) -> User {
    let user = database.find(id).unwrap();  // Panics if not found!
    user
}

// ❌ BAD: Using unwrap in library code
pub fn parse_config(path: &str) -> Config {
    let contents = fs::read_to_string(path).unwrap();
    serde_json::from_str(&contents).unwrap()
}
```

**Recommended Fix:**

```rust
// ✅ GOOD: Returns Result
pub fn get_user(id: u32) -> Result<User, DatabaseError> {
    database.find(id)
}

// ✅ GOOD: Proper error propagation
pub fn parse_config(path: &str) -> Result<Config, ConfigError> {
    let contents = fs::read_to_string(path)
        .map_err(ConfigError::Io)?;
    
    serde_json::from_str(&contents)
        .map_err(ConfigError::Parse)
}

#[derive(Debug)]
pub enum ConfigError {
    Io(std::io::Error),
    Parse(serde_json::Error),
}
```

---

### `ownership-patterns`

**Rule ID:** `ownership-patterns`  
**Category:** Idioms  
**Severity:** Informational  
**Autofix:** Not available

**Description:**  
Use appropriate ownership patterns: borrowing when possible, cloning when necessary.

**Example Violation:**

```rust
// ❌ BAD: Unnecessary clones
pub fn process_users(users: Vec<User>) -> Vec<String> {
    let mut result = Vec::new();
    for user in users.clone() {  // Unnecessary clone!
        result.push(user.name.clone());  // Unnecessary clone!
    }
    result
}
```

**Recommended Fix:**

```rust
// ✅ GOOD: Borrowing and taking ownership appropriately
pub fn process_users(users: Vec<User>) -> Vec<String> {
    users.into_iter()
        .map(|user| user.name)  // Take ownership of name
        .collect()
}

// Or if users is needed later:
pub fn process_users(users: &[User]) -> Vec<String> {
    users.iter()
        .map(|user| user.name.clone())  // Only clone strings
        .collect()
}
```

---

### `trait-usage`

**Rule ID:** `trait-usage`  
**Category:** Abstractions  
**Severity:** Informational  
**Autofix:** Not available

**Description:**  
Use traits for abstractions. Implement standard traits (Debug, Clone, etc.) where appropriate.

**Example Violation:**

```rust
// ❌ BAD: Missing standard trait implementations
pub struct User {
    pub id: u32,
    pub name: String,
}

impl User {
    pub fn copy(&self) -> User {  // Should use Clone trait
        User {
            id: self.id,
            name: self.name.clone(),
        }
    }
}
```

**Recommended Fix:**

```rust
// ✅ GOOD: Using standard traits
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct User {
    pub id: u32,
    pub name: String,
}

// For custom behavior:
impl Clone for User {
    fn clone(&self) -> Self {
        println!("Cloning user {}", self.id);
        User {
            id: self.id,
            name: self.name.clone(),
        }
    }
}
```

---

### `iterator-chains`

**Rule ID:** `iterator-chains`  
**Category:** Performance  
**Severity:** Informational  
**Autofix:** Available (Clippy)

**Description:**  
Prefer iterator chains over explicit loops for better performance and readability.

**Example Violation:**

```rust
// ❌ BAD: Explicit loop
fn sum_even_squares(nums: &[i32]) -> i32 {
    let mut result = 0;
    for &num in nums {
        if num % 2 == 0 {
            result += num * num;
        }
    }
    result
}
```

**Recommended Fix:**

```rust
// ✅ GOOD: Iterator chain
fn sum_even_squares(nums: &[i32]) -> i32 {
    nums.iter()
        .filter(|&&n| n % 2 == 0)
        .map(|&n| n * n)
        .sum()
}
```

---

### `module-organization`

**Rule ID:** `module-organization`  
**Category:** Structure  
**Severity:** Informational  
**Autofix:** Not available

**Description:**  
Follow Rust module conventions: mod.rs for modules, clear public API.

**Recommended Structure:**

```rust
// src/lib.rs - Public API
pub mod user;
pub mod order;

pub use user::User;
pub use order::Order;

// src/user/mod.rs - Module entry point
mod repository;
mod service;
mod validation;

pub use service::UserService;

// Private internals not exported
use repository::UserRepository;
use validation::validate_email;
```

---

## Configuration

```json
{
  "architectural-discipline": {
    "languages": {
      "rust": {
        "maxLines": 400,
        "maxComplexity": 10,
        "maxLinesPerFunction": 80,
        "enforceResultUsage": true,
        "warnOnUnwrap": true
      }
    }
  }
}
```

## Rust Idioms

ADP encourages Rust idioms:

1. **Ownership** - Prefer borrowing, clone only when needed
2. **Error Handling** - Use Result/Option, avoid panics in libraries
3. **Iterators** - Use iterator chains over explicit loops
4. **Traits** - Abstract behavior with traits
5. **Pattern Matching** - Use match instead of if chains
6. **Type Safety** - Leverage the type system

## Common Patterns

### Builder Pattern

```rust
pub struct User {
    id: u32,
    name: String,
    email: String,
}

pub struct UserBuilder {
    id: Option<u32>,
    name: Option<String>,
    email: Option<String>,
}

impl UserBuilder {
    pub fn new() -> Self {
        Self {
            id: None,
            name: None,
            email: None,
        }
    }
    
    pub fn id(mut self, id: u32) -> Self {
        self.id = Some(id);
        self
    }
    
    pub fn name(mut self, name: impl Into<String>) -> Self {
        self.name = Some(name.into());
        self
    }
    
    pub fn build(self) -> Result<User, &'static str> {
        Ok(User {
            id: self.id.ok_or("id required")?,
            name: self.name.ok_or("name required")?,
            email: self.email.ok_or("email required")?,
        })
    }
}
```

### Newtype Pattern

```rust
// Type safety with newtypes
pub struct UserId(u32);
pub struct OrderId(u32);

// Now these can't be confused:
fn get_user(id: UserId) -> User { /* ... */ }
fn get_order(id: OrderId) -> Order { /* ... */ }
```

## References

- [The Rust Programming Language](https://doc.rust-lang.org/book/)
- [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- [Rust Design Patterns](https://rust-unofficial.github.io/patterns/)
- [Clippy Lints](https://rust-lang.github.io/rust-clippy/)
