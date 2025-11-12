# ADP Rule Catalog Index

**Version:** 1.0.0  
**Last Updated:** 2024-11-12

This directory contains comprehensive rule catalogs for all languages supported by the Architectural Discipline Package (ADP).

## Available Catalogs

### [TypeScript/JavaScript Rules](typescript.md)
Complete rule reference for TypeScript and JavaScript codebases, including:
- File size limits by type (components, services, utilities)
- Cyclomatic complexity thresholds
- Function purity scoring
- Modularity and single responsibility enforcement
- ESLint integration details

### [PowerShell Rules](powershell.md)
PowerShell-specific rules covering:
- Module and script size guidelines
- Cmdlet complexity thresholds
- Approved verb usage
- Error handling best practices
- CmdletBinding conventions

### [C# Rules](csharp.md)
C# architectural rules including:
- Class size thresholds by type
- SOLID principle enforcement
- Async naming conventions
- IDisposable pattern validation
- Null reference safety

### [Rust Rules](rust.md)
Rust-specific guidelines covering:
- Module organization patterns
- Ownership and borrowing best practices
- Result/Option error handling
- Trait usage recommendations
- Iterator chain optimization

## Using the Rule Catalogs

### For Developers

Each catalog provides:
1. **Rule Descriptions** - What the rule checks
2. **Rationale** - Why the rule matters
3. **Examples** - Before/after code samples
4. **Severity Levels** - How critical violations are
5. **Autofix Availability** - Whether automatic fixes exist
6. **Configuration Options** - How to customize thresholds

### For Teams

Use these catalogs to:
- Establish coding standards
- Onboard new team members
- Configure ADP for your project
- Understand architectural recommendations
- Plan refactoring efforts

### For Architects

Catalogs help you:
- Enforce architectural patterns
- Measure technical debt
- Track improvement over time
- Define team standards
- Justify refactoring investments

## Rule Structure

Each rule follows this format:

```markdown
### `rule-id`

**Rule ID:** `rule-id`
**Category:** Category Name
**Severity:** Severity Level
**Autofix:** Available/Not available

**Description:** What the rule checks

**Rationale:** Why it matters

**Example Violation:** Bad code

**Recommended Fix:** Good code

**References:** Links to documentation
```

## Severity Levels

- **Error** - Must be fixed (critical architectural issues)
- **Warning** - Should be addressed (important issues)
- **Informational** - Consider improving (suggestions)

## Configuration

All rules can be configured in `.adp-config.json`:

```json
{
  "architectural-discipline": {
    "languages": {
      "typescript": {
        "maxLines": 300,
        "maxComplexity": 10,
        "maxLinesPerFunction": 50
      },
      "powershell": {
        "maxLines": 300,
        "maxComplexity": 10
      },
      "csharp": {
        "maxLines": 400,
        "maxComplexity": 12
      },
      "rust": {
        "maxLines": 400,
        "maxComplexity": 10
      }
    },
    "thresholds": {
      "criticalOutlierMultiplier": 1.5
    }
  }
}
```

## Statistical Analysis

ADP uses statistical analysis to:

1. **Classify Files** - Determine file type from content
2. **Establish Baselines** - Calculate expected ranges
3. **Identify Outliers** - Find files that deviate significantly
4. **Prioritize Issues** - Focus on critical architectural issues
5. **Track Progress** - Measure improvement over time

### File Type Classification

Files are automatically classified by analyzing:
- Naming patterns
- Import/dependency statements
- Code structure
- Keywords and patterns
- Exports and interfaces

### Outlier Detection

Statistical outliers are identified using:
- Z-score analysis
- Standard deviation thresholds
- 95th percentile calculations
- Critical outlier multipliers

## Integration

### CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Check Architecture
  run: |
    npm install -g @architectural-discipline/cli
    architectural-discipline analyze --path src --format json
```

### Pre-commit Hooks

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
architectural-discipline analyze --path src
```

### IDE Integration

- **VS Code**: Install ADP extension
- **JetBrains**: Use ESLint plugin with ADP rules
- **Vim/Neovim**: Configure ALE or CoC

## Contributing

To propose new rules:

1. Open an issue describing the rule
2. Provide rationale and examples
3. Suggest thresholds based on research
4. Include links to supporting documentation
5. Consider multi-language applicability

## Version History

- **1.0.0** (2024-11-12) - Initial rule catalog release
  - TypeScript/JavaScript rules
  - PowerShell rules
  - C# rules
  - Rust rules

## References

### General Software Architecture
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) by Robert C. Martin
- [Refactoring](https://martinfowler.com/books/refactoring.html) by Martin Fowler
- [Code Complete](https://www.amazon.com/Code-Complete-Practical-Handbook-Construction/dp/0735619670) by Steve McConnell
- [Software Architecture in Practice](https://www.amazon.com/Software-Architecture-Practice-3rd-Engineering/dp/0321815734)

### Language-Specific
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [PowerShell Best Practices](https://docs.microsoft.com/en-us/powershell/scripting/)
- [C# Coding Conventions](https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions)
- [The Rust Programming Language](https://doc.rust-lang.org/book/)

### Research Papers
- McCabe, T.J. (1976). "A Complexity Measure" - Cyclomatic complexity
- Chidamber & Kemerer (1994). "A Metrics Suite for Object Oriented Design"

## Support

For questions about rules or their enforcement:
- Open an issue in the ADP repository
- Reference the specific rule ID
- Include code examples if relevant
- Describe your use case

## License

These rule catalogs are part of the ADP project and licensed under MIT License.
