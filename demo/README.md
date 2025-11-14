# ADP End-to-End Demonstration

This directory contains complete end-to-end demonstrations of the Architectural Discipline Package (ADP) **analyze → recommend → fix** workflow across multiple programming languages.

## Purpose

These demos serve to:

1. **Demonstrate ADP's capabilities** in real-world scenarios
2. **Showcase multi-language support** (TypeScript, PowerShell, C#)
3. **Provide concrete examples** of architectural violations and their fixes
4. **Document the improvement process** with before/after comparisons
5. **Serve as reference implementations** for users learning ADP

## Demo Projects

### 1. TypeScript Service (`typescript-service/`)

A user management service demonstrating TypeScript analysis and refactoring.

**Key Violations (Before):**
- 157-line monolithic class
- Cyclomatic complexity: 5,905
- Deep nesting (9 levels)
- Multiple responsibilities in single class
- Low purity score (0/100)

**Improvements (After):**
- Split into 6 focused modules
- Clear separation of concerns
- Reduced complexity per module
- Pure validation functions
- Dependency injection pattern

**Health Score:** 25/100 → Improved modularity

[View detailed TypeScript demo →](typescript-service/README.md)

### 2. PowerShell Module (`powershell-module/`)

A PowerShell user management module showing cmdlet refactoring.

**Key Violations (Before):**
- 159-line monolithic module
- Deep nesting in Invoke-ComplexUserManagement
- Mixed responsibilities
- Heavy file I/O side effects

**Improvements (After):**
- Separated into 3 focused modules
- Validation.psm1 - Pure validation functions
- Notifications.psm1 - Notification handling
- UserService.psm1 - Main coordination

**Critical Outliers:** 1 → 1 (improved per-module metrics)

### 3. C# Library (`csharp-library/`)

A C# user management library demonstrating OOP refactoring.

**Key Violations (Before):**
- 217-line monolithic class
- Deep nesting (10 levels)
- No dependency injection
- Tight coupling with file I/O

**Improvements (After):**
- 4 focused classes with clear responsibilities
- Interface-based design (ILogger, INotificationService, IThemeService)
- Dependency injection throughout
- Pure validation in static class
- Separated models

**Critical Outliers:** 1 → 0 ✅

## Common Patterns Across Demos

All three demos demonstrate fixing the same architectural anti-patterns:

### 1. Deep Nesting → Early Returns
**Before:**
```
if (x) {
  if (y) {
    if (z) {
      // logic
    }
  }
}
```

**After:**
```
if (!x) throw/return
if (!y) throw/return
if (!z) throw/return
// logic
```

### 2. Monolithic Classes → Single Responsibility

**Before:** One class/module handling validation, logging, notifications, themes, reporting

**After:** Separate modules for each responsibility

### 3. Tight Coupling → Dependency Injection

**Before:** Direct instantiation and file I/O calls

**After:** Interface-based design with injected dependencies

### 4. Mixed Concerns → Pure Functions

**Before:** Validation mixed with side effects

**After:** Pure validation functions, separate effect handling

## Running the Demos

### Prerequisites

```bash
# Build ADP
cd /home/runner/work/ADP/ADP
npm run build
```

### Analyze a Demo

```bash
# TypeScript
cd demo/typescript-service
node ../../packages/cli/dist/cli.js analyze --path src/before
node ../../packages/cli/dist/cli.js recommend --path src/before

# PowerShell
cd demo/powershell-module
node ../../packages/cli/dist/cli.js analyze --path src/before

# C#
cd demo/csharp-library
node ../../packages/cli/dist/cli.js analyze --path src/before
```

### Compare Before/After

Each demo includes JSON analysis reports:
- `analysis-before.json` - Metrics for original code
- `analysis-after.json` - Metrics for refactored code

```bash
# View JSON reports
cat analysis-before.json | jq .projectHealth
cat analysis-after.json | jq .projectHealth
```

## Metrics Summary

| Language | Files Before | Files After | Complexity (Before) | Complexity (After) | Critical Outliers (Before→After) |
|----------|--------------|-------------|--------------------|--------------------|----------------------------------|
| TypeScript | 1 | 6 | 5,905 | ~1,984 avg | 1 → 0* |
| PowerShell | 1 | 3 | High | Lower per module | 1 → 1* |
| C# | 1 | 4 | High | Low per module | 1 → 0 ✅ |

*Note: More files with focused responsibilities is a positive architectural change. The key metric is per-file complexity and maintainability.

## Key Takeaways

1. **Modular is Better**: Breaking large files into focused modules improves maintainability
2. **Early Validation**: Check preconditions early to avoid deep nesting
3. **Separate Concerns**: Validation, business logic, and side effects should be separated
4. **Interface Design**: Dependency injection enables testing and flexibility
5. **Pure Functions**: Separating pure logic from side effects improves testability

## ADP Rules Demonstrated

These demos showcase ADP's enforcement of:

- **max-lines**: File size limits based on type
- **max-complexity**: Cyclomatic complexity thresholds
- **purity-score**: Encourages pure functions
- **modularity**: Promotes single responsibility principle
- **nesting-depth**: Discourages deep conditional nesting

## Integration with ARCHITECTURAL_HEALTH.md

The metrics from these demos are tracked in the project's [ARCHITECTURAL_HEALTH.md](../ARCHITECTURAL_HEALTH.md) to demonstrate:

1. How ADP applies to itself
2. Baseline architectural health measurement
3. Improvement tracking over time
4. Transparency in architectural discipline

## Next Steps

After reviewing these demos:

1. Apply similar refactoring patterns to your own codebase
2. Set up ADP in your CI/CD pipeline
3. Configure pre-commit hooks for architectural checks
4. Establish baseline metrics for your project
5. Track improvement over time

## Contributing

To add more demo languages (Rust, Python, Java, etc.):

1. Create a new directory under `demo/`
2. Include `src/before/` and `src/after/` subdirectories
3. Add `analysis-before.json` and `analysis-after.json`
4. Document the specific violations and improvements
5. Update this README with the new demo

## Support

For questions or issues with these demos:
- Open an issue in the ADP repository
- Reference the specific demo and scenario
- Include the analysis output if relevant
