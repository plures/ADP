# Architectural Discipline Package

[![CI](https://github.com/plures/ADP/actions/workflows/ci.yml/badge.svg)](https://github.com/plures/ADP/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@architectural-discipline/core.svg)](https://www.npmjs.com/package/@architectural-discipline/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/@architectural-discipline/core.svg)](https://nodejs.org)

A comprehensive toolkit for enforcing sustainable software architecture patterns through intelligent analysis, automated refactoring recommendations, and consistent code quality standards.

**🔍 ADP Applies to Itself**: This project uses its own architectural discipline tools for self-governance. See [ARCHITECTURAL_HEALTH.md](ARCHITECTURAL_HEALTH.md) for our current metrics and improvement plan.

## 🎯 Overview

The Architectural Discipline Package provides a complete solution for maintaining high-quality, maintainable software architecture across projects of any size. It combines statistical analysis, ESLint integration, CLI tooling, and project templates to create a unified approach to architectural excellence.

**Multi-Language Support**: ADP now supports analysis for multiple programming languages including JavaScript/TypeScript, PowerShell, C#, and Rust, allowing you to apply the same architectural discipline principles across your entire codebase.

## 📦 Packages

### Core Packages

- **`@architectural-discipline/core`** - Statistical analysis engine and rule definitions with multi-language support
- **`@architectural-discipline/eslint-plugin`** - ESLint plugin for architectural rules (TypeScript/JavaScript)
- **`@architectural-discipline/cli`** - Command-line interface for analysis and refactoring across all supported languages

### Project Templates

#### TypeScript/JavaScript Templates
- **`@architectural-discipline/template-vscode-extension`** - VS Code extension template
- **`@architectural-discipline/template-web-app`** - Web application template
- **`@architectural-discipline/template-mobile-app`** - Mobile application template
- **`@architectural-discipline/template-cli-tool`** - CLI tool template
- **`@architectural-discipline/template-library`** - Library template
- **`@architectural-discipline/template-api-service`** - API service template

#### PowerShell Templates
- **`powershell-module`** - PowerShell module template (.psm1, .psd1)
- **`powershell-cli`** - PowerShell CLI script template (.ps1)

#### C# Templates
- **`csharp-library`** - C# class library template (.csproj)
- **`csharp-console`** - C# console application template

#### Rust Templates
- **`rust-library`** - Rust library template (lib.rs)
- **`rust-cli`** - Rust CLI binary template (main.rs)

## 🚀 Quick Start

### Installation

**Recommended: Universal Installer (Works with any project type)**

```bash
# Using npx (no installation required)
npx @architectural-discipline/installer install

# Or using npm create
npm create adp@latest
```

**Direct Package Installation (Node.js/TypeScript)**

```bash
# Install the CLI globally
npm install -g @architectural-discipline/cli

# Or install specific packages
npm install --save-dev @architectural-discipline/cli @architectural-discipline/core @architectural-discipline/eslint-plugin
```

**Deno Installation**

```bash
# Add to deno.json and run
deno task adp:analyze

# Or run directly
deno run npm:@architectural-discipline/cli analyze
```

**Offline Installation (Air-Gapped Environments)**

```bash
# Download bundle on connected machine
npx @architectural-discipline/installer download-offline

# Transfer to air-gapped system and install
cd adp-offline
node install-offline.js
```

📖 **[Complete Installation Guide](INSTALLATION.md)** - Detailed instructions for all platforms and scenarios

### Basic Usage

```bash
# Analyze your project (supports multiple languages automatically)
architectural-discipline analyze

# Analyze specific path
architectural-discipline analyze --path src

# Generate refactoring recommendations
architectural-discipline recommend

# Create a new project with architectural discipline
architectural-discipline create my-project --template web-app

# List all available templates
architectural-discipline create --list-templates

# Create PowerShell module
architectural-discipline create my-module --template powershell-module

# Create C# library
architectural-discipline create my-lib --template csharp-library

# Create Rust CLI
architectural-discipline create my-cli --template rust-cli
```

### Multi-Language Analysis

The CLI automatically detects and analyzes files from supported languages:

- **TypeScript/JavaScript**: `.ts`, `.tsx`, `.js`, `.jsx`
- **PowerShell**: `.ps1`, `.psm1`
- **C#**: `.cs`, `.csx`
- **Rust**: `.rs`

Analysis results include language-specific metrics and recommendations tailored to each language's conventions.

### ESLint Integration

```javascript
// eslint.config.js
import architecturalDiscipline from '@architectural-discipline/eslint-plugin';

export default [
  architecturalDiscipline.configs.recommended,
  {
    rules: {
      '@architectural-discipline/max-lines': 'error',
      '@architectural-discipline/max-complexity': 'warn',
    }
  }
];
```

## 🏗️ Architecture

The package follows a modular architecture with clear separation of concerns:

```
packages/
├── core/                    # Statistical analysis engine
├── eslint-plugin/          # ESLint integration
├── cli/                    # Command-line interface
└── templates/              # Project templates
    ├── vscode-extension/
    ├── web-app/
    ├── mobile-app/
    ├── cli-tool/
    ├── library/
    └── api-service/
```

## 📊 Features

### Multi-Language Support
- **JavaScript/TypeScript**: Full support with ESLint integration
- **PowerShell**: Analysis for `.ps1`, `.psm1`, and module files
- **C#**: Analysis for `.cs` and `.csx` files with project structure awareness
- **Rust**: Analysis for `.rs` files with crate and module understanding
- **Unified Metrics**: Same architectural principles applied consistently across all languages

### Intelligent Analysis
- **Statistical Analysis**: Analyzes codebase patterns and identifies outliers per language
- **Complexity Metrics**: Measures cyclomatic complexity and cognitive load (language-specific)
- **Purity Scoring**: Evaluates function purity and side effects (language-aware)
- **Modularity Assessment**: Analyzes module cohesion and coupling

### Automated Recommendations
- **Refactoring Suggestions**: Provides specific, actionable refactoring recommendations
- **Priority Classification**: Categorizes issues by severity and impact
- **Context-Aware**: Considers project type and domain-specific patterns
- **Incremental Improvement**: Supports gradual architectural improvement

### Quality Enforcement
- **ESLint Integration**: Seamless integration with existing linting workflows
- **Pre-commit Hooks**: Automated quality checks before commits
- **CI/CD Integration**: Continuous quality monitoring in pipelines
- **Customizable Rules**: Configurable thresholds and rule sets

### Project Templates
- **Best Practices**: Pre-configured with architectural discipline rules
- **Framework Support**: Templates for popular frameworks and platforms
- **Documentation**: Comprehensive guides and examples
- **Migration Support**: Tools for adding discipline to existing projects

## 🎨 Philosophy

The Architectural Discipline Package is built on the principle that **sustainable software architecture requires consistent, measurable practices**. It provides:

1. **Objective Metrics**: Quantifiable measures of code quality and maintainability
2. **Actionable Insights**: Specific recommendations rather than abstract principles
3. **Gradual Adoption**: Incremental improvement without disrupting existing workflows
4. **Community Standards**: Shared understanding of architectural excellence
5. **Self-Governance**: ADP uses its own tools to maintain its codebase quality

### Leading by Example

ADP applies its own architectural discipline principles to itself:
- **Current Health Score**: 27/100 (baseline established)
- **Continuous Monitoring**: Automated analysis runs before commits
- **Transparent Improvement**: All metrics and improvement plans are documented
- **Incremental Refactoring**: Following the gradual improvement approach we recommend

See [ARCHITECTURAL_HEALTH.md](ARCHITECTURAL_HEALTH.md) for detailed metrics and our improvement roadmap.

## 🔍 Prior Art & Comparisons

ADP builds on and complements existing architectural tooling. Here's how it compares:

### vs. ESLint Architectural Plugins

**ESLint Plugins (eslint-plugin-import, eslint-plugin-boundaries):**
- ✅ Deep TypeScript/JavaScript integration
- ✅ Real-time IDE feedback
- ❌ Limited to JavaScript ecosystem
- ❌ Manual rule configuration required
- ❌ No statistical analysis

**ADP:**
- ✅ Multi-language support (TypeScript, PowerShell, C#, Rust)
- ✅ Statistical analysis automatically determines thresholds
- ✅ File type classification without manual configuration
- ✅ Integrated with ESLint for JavaScript/TypeScript
- ✅ Holistic project health scoring

**Use Together:** ADP complements ESLint by providing higher-level architectural analysis while ESLint handles syntax and style.

### vs. Dependency Analysis Tools (Madge, dependency-cruiser)

**Madge / dependency-cruiser:**
- ✅ Excellent dependency visualization
- ✅ Circular dependency detection
- ✅ Detailed module graphs
- ❌ Focused only on dependencies
- ❌ No complexity or size analysis
- ❌ Manual threshold configuration

**ADP:**
- ✅ Analyzes dependencies, complexity, size, and purity
- ✅ Statistical thresholds adapt to your codebase
- ✅ Provides refactoring recommendations
- ✅ Multi-language support
- ✅ Project health trending over time
- 🔄 Dependency graphing planned (future feature)

**Use Together:** Combine ADP for overall architecture with Madge for detailed dependency visualization.

### vs. Architecture Testing Frameworks (ArchUnit, NetArchTest)

**ArchUnit (Java) / NetArchTest (.NET):**
- ✅ Enforce architectural rules as tests
- ✅ Layer dependency rules
- ✅ Naming conventions
- ✅ Strong type safety
- ❌ Single language per tool
- ❌ Requires writing test code
- ❌ No statistical analysis
- ❌ Binary pass/fail (no gradual improvement)

**ADP:**
- ✅ Multi-language support in one tool
- ✅ Statistical analysis finds issues automatically
- ✅ Gradual improvement model
- ✅ Works without writing tests
- ✅ Provides concrete refactoring suggestions
- ✅ Tracks improvement over time
- 🔄 Layer rules planned (future feature)

**Use Together:** Use ArchUnit/NetArchTest for strict architectural constraints in tests, ADP for continuous quality measurement and improvement tracking.

### Unique ADP Advantages

1. **Multi-Language Consistency**: Same architectural principles across TypeScript, PowerShell, C#, Rust, and more
2. **Statistical Intelligence**: Automatically learns your codebase patterns and identifies outliers
3. **File Type Classification**: Understands that components, services, and utilities have different expected characteristics
4. **Gradual Improvement**: Designed for incremental refactoring, not "big bang" changes
5. **Self-Documenting**: Applies its own rules to itself, demonstrating transparency
6. **Actionable Recommendations**: Doesn't just report problems, suggests specific fixes
7. **Project Health Scoring**: Single metric that tracks overall architecture quality

### When to Use Which Tool

| Scenario | Recommended Tool(s) |
|----------|-------------------|
| JavaScript/TypeScript linting | ESLint + ADP |
| Visualize module dependencies | Madge or dependency-cruiser |
| Enforce layer boundaries (Java) | ArchUnit + ADP |
| Enforce layer boundaries (.NET) | NetArchTest + ADP |
| Multi-language architecture analysis | **ADP** |
| Statistical complexity analysis | **ADP** |
| Gradual refactoring guidance | **ADP** |
| Cross-language consistency | **ADP** |
| Project health trends | **ADP** |

### Integration Strategy

ADP is designed to work alongside your existing tools:

```yaml
# Example CI/CD integration
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      # Syntax and style
      - run: npm run lint
      
      # Architecture analysis
      - run: architectural-discipline analyze
      
      # Dependency graph (if using Madge)
      - run: madge --circular src/
      
      # Unit tests with ArchUnit/NetArchTest
      - run: npm test
```

### Philosophy Differences

**Traditional Tools:** "Does this code violate a specific rule?"  
**ADP:** "Is this file an outlier compared to similar files in this codebase?"

**Traditional Tools:** Manual threshold configuration  
**ADP:** Statistical analysis determines expected ranges

**Traditional Tools:** Binary pass/fail  
**ADP:** Graduated severity with improvement tracking

**Traditional Tools:** Single language focus  
**ADP:** Multi-language architectural consistency

## 📚 Documentation

### Getting Started
- [Getting Started](docs/getting-started.md)
- [Multi-Language Usage](docs/multi-language-usage.md) - Guide for using ADP with PowerShell, C#, Rust, and more
- [Installation Guide](INSTALLATION.md) - Detailed installation instructions for all platforms
- [End-to-End Demos](demo/README.md) - Complete examples showing analyze → recommend → fix workflow

### Rule Catalogs
- **[Rule Catalog Index](docs/rules/README.md)** - Overview of all rules
- [TypeScript/JavaScript Rules](docs/rules/typescript.md) - Complete rule reference with examples
- [PowerShell Rules](docs/rules/powershell.md) - PowerShell-specific architectural rules
- [C# Rules](docs/rules/csharp.md) - C# and .NET guidelines
- [Rust Rules](docs/rules/rust.md) - Rust idioms and best practices

### Reference
- [Core Concepts](docs/core-concepts.md)
- [ESLint Plugin](docs/eslint-plugin.md)
- [CLI Reference](docs/cli-reference.md)
- [Project Templates](docs/templates.md)
- [Migration Guide](docs/migration-guide.md)
- [API Reference](docs/api-reference.md)

### Self-Governance
- [Architectural Health Report](ARCHITECTURAL_HEALTH.md) - ADP's self-governance metrics
- [Development Process](DevelopmentProcess.md) - How we use ADP on itself

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

Built with inspiration from:
- Clean Architecture principles
- SOLID design principles
- Statistical analysis methodologies
- Modern JavaScript/TypeScript best practices
- Community-driven quality standards
