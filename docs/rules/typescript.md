# ADP Rule Catalog - TypeScript/JavaScript

**Version:** 1.0.0  
**Last Updated:** 2024-11-12

This document describes all architectural discipline rules enforced by ADP for TypeScript and JavaScript codebases.

## Overview

ADP uses statistical analysis to identify architectural outliers and provide intelligent recommendations. Rules are based on file type classification and empirical thresholds derived from analyzing thousands of well-architected codebases.

## Rule Categories

1. **Size Rules** - File and function length limits
2. **Complexity Rules** - Cyclomatic complexity thresholds
3. **Purity Rules** - Side effect and functional purity checks
4. **Modularity Rules** - Coupling and cohesion metrics
5. **Dependency Rules** - Import and dependency management

---

## Size Rules

### `max-lines`

**Rule ID:** `max-lines`  
**Category:** Size  
**Severity:** Warning → Error (critical outliers)  
**Autofix:** Not available (requires manual refactoring)

**Description:**  
Enforces maximum file size based on file type classification. Files exceeding expected ranges indicate violation of single responsibility principle.

**Rationale:**  
- Large files are harder to understand and maintain
- Violates single responsibility principle
- Increases cognitive load for developers
- Makes testing more difficult
- Often indicates mixed concerns

**Detection:**  
Files are classified by type (component, service, utility, etc.) using pattern matching and content analysis. Each type has an expected size range based on statistical analysis:

| File Type | Expected Range | Category |
|-----------|----------------|----------|
| Component | 50-200 lines | UI Component |
| Service | 100-400 lines | Business Logic |
| Utility | 30-150 lines | Helper Functions |
| Config | 10-100 lines | Configuration |
| Test | 50-300 lines | Test Suite |
| Model/Type | 20-150 lines | Data Definitions |

**Example Violation:**

```typescript
// ❌ BAD: 300-line component mixing multiple concerns
export class UserProfileComponent {
  // 100+ lines of component logic
  // 50+ lines of data fetching
  // 50+ lines of validation
  // 100+ lines of rendering logic
}
```

**Recommended Fix:**

```typescript
// ✅ GOOD: Separated concerns into focused files
// UserProfileComponent.tsx (80 lines)
export class UserProfileComponent {
  // Component logic only
}

// UserProfileService.ts (60 lines)
export class UserProfileService {
  // Data fetching logic
}

// UserProfileValidator.ts (40 lines)
export class UserProfileValidator {
  // Validation logic
}
```

**References:**
- Clean Code by Robert C. Martin
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)

---

### `max-lines-per-function`

**Rule ID:** `max-lines-per-function`  
**Category:** Size  
**Severity:** Warning  
**Autofix:** Partial (extract function refactoring suggestions)

**Description:**  
Enforces maximum function length. Functions exceeding 50 lines typically do too much and should be decomposed.

**Rationale:**  
- Long functions are hard to understand
- Difficult to test thoroughly
- Often have multiple responsibilities
- Higher likelihood of bugs
- Harder to reuse

**Detection:**  
Counts lines of code within function bodies, excluding comments and whitespace.

**Threshold:** 50 lines per function (configurable)

**Example Violation:**

```typescript
// ❌ BAD: 80-line function doing too much
function processOrder(order: Order) {
  // 20 lines of validation
  // 20 lines of price calculation
  // 20 lines of inventory check
  // 20 lines of payment processing
}
```

**Recommended Fix:**

```typescript
// ✅ GOOD: Decomposed into focused functions
function processOrder(order: Order) {
  validateOrder(order);
  const price = calculatePrice(order);
  checkInventory(order);
  processPayment(order, price);
}

function validateOrder(order: Order) {
  // 15 lines of validation
}

function calculatePrice(order: Order): number {
  // 15 lines of calculation
}

function checkInventory(order: Order) {
  // 15 lines of inventory logic
}

function processPayment(order: Order, amount: number) {
  // 15 lines of payment logic
}
```

**References:**
- [Function Length](https://refactoring.guru/smells/long-method)

---

## Complexity Rules

### `max-complexity`

**Rule ID:** `max-complexity`  
**Category:** Complexity  
**Severity:** Warning → Error (critical outliers)  
**Autofix:** Not available (requires refactoring)

**Description:**  
Measures cyclomatic complexity - the number of linearly independent paths through code. High complexity indicates difficult-to-test, error-prone code.

**Rationale:**  
- High complexity correlates with defect density
- Makes code hard to understand and modify
- Increases testing requirements exponentially
- Indicates overly complex conditional logic
- Harder to reason about edge cases

**Detection:**  
Calculates cyclomatic complexity by counting:
- Conditional statements (if, else if, ternary)
- Loops (for, while, do-while)
- Case statements
- Boolean operators (&&, ||)
- Optional chaining (?.)

**Thresholds by File Type:**

| File Type | Threshold | Rationale |
|-----------|-----------|-----------|
| Utility | 6 | Simple helper functions |
| Component | 8 | UI logic can be slightly more complex |
| Service | 12 | Business logic may have more branches |
| Test | 15 | Tests may have multiple scenarios |

**Example Violation:**

```typescript
// ❌ BAD: Complexity score of 15
function calculateDiscount(user: User, order: Order): number {
  if (user.isPremium) {
    if (order.total > 100) {
      if (order.items.length > 5) {
        return 0.20;
      } else if (order.items.length > 3) {
        return 0.15;
      } else {
        return 0.10;
      }
    } else if (order.total > 50) {
      return 0.10;
    } else {
      return 0.05;
    }
  } else {
    if (order.total > 100) {
      return 0.10;
    } else if (order.total > 50) {
      return 0.05;
    } else {
      return 0;
    }
  }
}
```

**Recommended Fix:**

```typescript
// ✅ GOOD: Complexity score of 4 per function
const DISCOUNT_TIERS = {
  premium: [
    { minTotal: 100, minItems: 5, discount: 0.20 },
    { minTotal: 100, minItems: 3, discount: 0.15 },
    { minTotal: 100, minItems: 0, discount: 0.10 },
    { minTotal: 50, minItems: 0, discount: 0.10 },
    { minTotal: 0, minItems: 0, discount: 0.05 },
  ],
  regular: [
    { minTotal: 100, discount: 0.10 },
    { minTotal: 50, discount: 0.05 },
    { minTotal: 0, discount: 0 },
  ]
};

function calculateDiscount(user: User, order: Order): number {
  const tiers = user.isPremium ? DISCOUNT_TIERS.premium : DISCOUNT_TIERS.regular;
  return findApplicableDiscount(order, tiers);
}

function findApplicableDiscount(order: Order, tiers: DiscountTier[]): number {
  const tier = tiers.find(t => 
    order.total >= t.minTotal && 
    (!t.minItems || order.items.length >= t.minItems)
  );
  return tier?.discount ?? 0;
}
```

**References:**
- [Cyclomatic Complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity)
- McCabe, T.J. (1976). "A Complexity Measure"

---

## Purity Rules

### `purity-score`

**Rule ID:** `purity-score`  
**Category:** Purity  
**Severity:** Informational → Warning  
**Autofix:** Not available (design decision)

**Description:**  
Measures function purity by detecting side effects. Pure functions are easier to test, reason about, and parallelize.

**Rationale:**  
- Pure functions are deterministic and predictable
- Easier to test (no mocking needed)
- Can be memoized for performance
- No unexpected side effects
- Facilitates parallel execution

**Detection:**  
Identifies side effects:
- File system operations
- Network requests
- Database queries
- Console output
- Global variable modification
- Random number generation
- Date/time access

**Scoring:**  
- 100 = Pure function (no side effects detected)
- 50-99 = Some side effects
- 0-49 = Heavy side effects

**Example Violation:**

```typescript
// ❌ BAD: Impure function with side effects
function calculateTotal(items: Item[]): number {
  console.log('Calculating total...'); // Side effect: console
  const total = items.reduce((sum, item) => sum + item.price, 0);
  
  // Side effect: file I/O
  fs.appendFileSync('audit.log', `Total calculated: ${total}\n`);
  
  return total;
}
```

**Recommended Fix:**

```typescript
// ✅ GOOD: Pure calculation, side effects handled separately
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

function calculateAndLog(items: Item[], logger: Logger): number {
  logger.info('Calculating total...');
  const total = calculateTotal(items);
  logger.audit(`Total calculated: ${total}`);
  return total;
}
```

**References:**
- [Pure Functions](https://en.wikipedia.org/wiki/Pure_function)
- Functional Programming Principles

---

## Modularity Rules

### `single-responsibility`

**Rule ID:** `single-responsibility`  
**Category:** Modularity  
**Severity:** Warning  
**Autofix:** Not available (requires architectural changes)

**Description:**  
Detects files with multiple responsibilities based on keyword analysis and structural patterns.

**Rationale:**  
- Each module should have one reason to change
- Improves cohesion
- Reduces coupling
- Makes code easier to understand
- Facilitates reuse

**Detection:**  
Analyzes files for multiple responsibility patterns:
- Multiple unrelated exports
- Mixed domain concepts
- Combined infrastructure and business logic
- Mixed concerns (validation + data access + UI)

**Example Violation:**

```typescript
// ❌ BAD: Multiple responsibilities in one file
// UserManagement.ts

export class UserValidator { /* validation logic */ }
export class UserRepository { /* data access */ }
export class UserService { /* business logic */ }
export class UserController { /* HTTP handling */ }
export function formatUserName(name: string) { /* formatting */ }
```

**Recommended Fix:**

```typescript
// ✅ GOOD: Separated into focused files

// UserValidator.ts
export class UserValidator { /* validation only */ }

// UserRepository.ts
export class UserRepository { /* data access only */ }

// UserService.ts
export class UserService { /* business logic only */ }

// UserController.ts
export class UserController { /* HTTP handling only */ }

// UserFormatters.ts
export function formatUserName(name: string) { /* formatting only */ }
```

---

## Configuration

Rules can be configured in `.adp-config.json`:

```json
{
  "architectural-discipline": {
    "languages": {
      "typescript": {
        "maxLines": 300,
        "maxComplexity": 10,
        "maxLinesPerFunction": 50,
        "minPurityScore": 50
      }
    },
    "thresholds": {
      "criticalOutlierMultiplier": 1.5
    }
  }
}
```

## Severity Levels

- **Informational**: FYI, consider improving
- **Warning**: Should be addressed
- **Error**: Must be fixed (critical outliers)

## Autofix Availability

| Rule | Autofix Available |
|------|-------------------|
| max-lines | ❌ No (requires manual refactoring) |
| max-lines-per-function | 🟡 Partial (suggestions only) |
| max-complexity | ❌ No (requires redesign) |
| purity-score | ❌ No (design decision) |
| single-responsibility | ❌ No (architectural change) |

## Further Reading

- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Refactoring: Improving the Design of Existing Code](https://martinfowler.com/books/refactoring.html)
- [Code Complete](https://www.amazon.com/Code-Complete-Practical-Handbook-Construction/dp/0735619670)
