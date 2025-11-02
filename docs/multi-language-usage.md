# Multi-Language Usage Guide

The Architectural Discipline Package supports multiple programming languages. This guide demonstrates how to use ADP with each supported language.

## Supported Languages

- **TypeScript/JavaScript** - `.ts`, `.tsx`, `.js`, `.jsx`
- **PowerShell** - `.ps1`, `.psm1`, `.psd1`
- **C#** - `.cs`, `.csx`
- **Rust** - `.rs`

## Basic Usage

### Analyzing a Multi-Language Project

The CLI automatically detects and analyzes files from all supported languages:

```bash
# Analyze entire project (detects all languages automatically)
architectural-discipline analyze

# Analyze specific directory
architectural-discipline analyze --path src

# Generate JSON report
architectural-discipline analyze --format json --output report.json
```

## Language-Specific Examples

### PowerShell

PowerShell files are automatically detected and analyzed with PowerShell-specific patterns:

**Example PowerShell Module** (`examples/powershell-example.ps1`):

```powershell
function Get-UserData {
    param(
        [Parameter(Mandatory=$true)]
        [string]$UserId
    )
    
    $user = Get-ADUser -Identity $UserId
    return $user
}
```

**Analysis Results:**
- Functions are detected using PowerShell's `function Verb-Noun` pattern
- Complexity includes PowerShell-specific keywords (`-and`, `-or`, `foreach`, etc.)
- Side effects detect PowerShell cmdlets (`Write-Output`, `Get-Content`, etc.)
- File types: `module`, `script`, `function`, `test`, `config`

### C#

C# files are analyzed with C#-specific patterns and project structure awareness:

**Example C# Service** (`examples/csharp-example.cs`):

```csharp
public class UserService
{
    public async Task<User> GetUserAsync(int userId)
    {
        var response = await _httpClient.GetAsync($"api/users/{userId}");
        return await response.Content.ReadAsAsync<User>();
    }
}
```

**Analysis Results:**
- Methods are detected including async/await patterns
- Complexity includes C# operators (`&&`, `||`, `??`, etc.)
- Side effects detect async operations, file I/O, network calls
- File types: `class`, `controller`, `service`, `handler`, `test`, `config`

### Rust

Rust files are analyzed with Rust-specific patterns:

**Example Rust Module** (`examples/rust-example.rs`):

```rust
pub struct UserService {
    users: HashMap<u32, User>,
}

impl UserService {
    pub fn create_user(&mut self, name: String, email: String) -> Result<User, String> {
        // Implementation
    }
}
```

**Analysis Results:**
- Functions detected including `pub`, `async`, `unsafe`
- Complexity includes Rust patterns (`match`, `if let`, `while let`)
- Side effects detect `unwrap()`, `expect()`, async operations, file I/O
- File types: `module`, `service`, `handler`, `utility`, `test`, `config`

### TypeScript/JavaScript

TypeScript and JavaScript maintain full ESLint integration:

**Example TypeScript Service** (`examples/typescript-example.ts`):

```typescript
export class UserService {
  async getUser(userId: number): Promise<User | null> {
    const response = await this.httpClient.get<User>(`/users/${userId}`);
    return response.data;
  }
}
```

**Analysis Results:**
- Functions detected including arrow functions, async/await
- Full ESLint integration for TypeScript/JavaScript
- File types: `machine`, `client`, `handler`, `utility`, `test`, `config`

## Mixed-Language Projects

ADP seamlessly handles projects with multiple languages:

```bash
# Project structure
project/
├── src/
│   ├── frontend/          # TypeScript
│   │   └── app.ts
│   ├── backend/           # C#
│   │   └── Services/
│   ├── scripts/           # PowerShell
│   │   └── deploy.ps1
│   └── lib/               # Rust
│       └── parser.rs
```

Running `architectural-discipline analyze` will:
1. Detect each file's language automatically
2. Apply language-specific analyzers
3. Provide unified metrics across all languages
4. Generate recommendations tailored to each language

## Language-Specific File Patterns

Each language has optimized file type classifications:

### PowerShell Patterns
- **Modules**: `.psm1`, `Modules/` directory
- **Scripts**: `.ps1` files
- **Functions**: Functions in `Functions/` or `Verb-Noun` naming
- **Tests**: `.Tests.ps1` files

### C# Patterns
- **Controllers**: `Controllers/` directory, `*Controller.cs`
- **Services**: `Services/` directory, `*Service.cs`
- **Models**: `Models/` directory, `*Model.cs`, `*Entity.cs`
- **Tests**: `*Tests.cs`, `*Test.cs`

### Rust Patterns
- **Services**: `services/` directory, `*service.rs`
- **Handlers**: `handlers/` directory, `*handler.rs`
- **Modules**: `src/` directory, `lib.rs`, `main.rs`
- **Tests**: `*test.rs`, `tests/` directory

## Recommendations

Refactoring recommendations are tailored to each language:

### PowerShell
- Extract large PowerShell functions into separate modules
- Reduce cmdlet chaining complexity
- Use proper error handling with try-catch

### C#
- Extract large methods, especially async methods
- Reduce async/await nesting
- Use dependency injection patterns

### Rust
- Reduce complexity in match expressions
- Extract error handling logic
- Use proper ownership patterns

## Best Practices

1. **Consistent Structure**: Maintain consistent file organization across languages
2. **Language Conventions**: Follow each language's naming and structure conventions
3. **Unified Metrics**: Use ADP's unified metrics to track architectural health across languages
4. **Incremental Improvement**: Address recommendations by priority across all languages

## Configuration

You can customize analysis by language in your project configuration:

```json
{
  "architectural-discipline": {
    "languages": {
      "powershell": {
        "maxLines": 400,
        "maxComplexity": 12
      },
      "csharp": {
        "maxLines": 500,
        "maxComplexity": 15
      },
      "rust": {
        "maxLines": 450,
        "maxComplexity": 10
      }
    }
  }
}
```

## See Also

- [Getting Started Guide](getting-started.md)
- [CLI Reference](cli-reference.md)
- [Core Concepts](core-concepts.md)

