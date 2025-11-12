# Contributing to ADP

Thank you for your interest in contributing to the Architectural Discipline Package! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Good First Issues](#good-first-issues)

## Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. We expect all contributors to:

- Be respectful and considerate
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/ADP.git
   cd ADP
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/plures/ADP.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Build the project**:
   ```bash
   npm run build
   ```

## How to Contribute

### Reporting Bugs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug-report.yml) and include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node version, ADP version)
- Relevant logs or error messages

### Suggesting Features

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature-request.yml) and describe:
- The problem you're trying to solve
- Your proposed solution
- Alternative approaches you've considered
- Examples of how it would be used

### Good First Issues

Look for issues labeled [`good first issue`](https://github.com/plures/ADP/labels/good%20first%20issue). These are:
- Well-defined and scoped
- Good for newcomers to the project
- Have mentorship available
- Include helpful context and resources

## Development Setup

### Project Structure

```
ADP/
├── packages/
│   ├── core/           # Statistical analysis engine
│   ├── cli/            # Command-line interface
│   ├── eslint-plugin/  # ESLint integration
│   └── installer/      # Installation utilities
├── demo/               # End-to-end demos
├── docs/               # Documentation
│   └── rules/         # Rule catalogs
└── examples/           # Code examples
```

### Building

```bash
# Build all packages
npm run build

# Build and watch for changes
npm run dev

# Build specific package
cd packages/core && npm run build
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests for specific package
cd packages/core && npm test

# Run tests with coverage
npm run test:coverage
```

### Linting

```bash
# Lint all packages
npm run lint

# Fix linting issues
npm run lint:fix
```

### Running the CLI Locally

```bash
# After building
node packages/cli/dist/cli.js analyze --path examples

# Or use npm link
cd packages/cli
npm link
architectural-discipline analyze
```

## Code Style

### TypeScript Guidelines

- Use TypeScript for all new code
- Follow existing code style (enforced by ESLint)
- Use clear, descriptive variable names
- Add JSDoc comments for public APIs
- Keep functions focused and small

### Example

```typescript
/**
 * Analyzes a file for architectural violations.
 * @param filePath - Path to the file to analyze
 * @param config - Configuration options
 * @returns Analysis results with outliers and recommendations
 */
export function analyzeFile(
  filePath: string,
  config: AnalysisConfig
): AnalysisResult {
  // Implementation
}
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Python language support
fix: correct complexity calculation for switch statements
docs: update PowerShell rule catalog
test: add tests for C# analyzer
refactor: extract validation logic
```

### Branch Naming

Use descriptive branch names:

```
feature/python-support
fix/powershell-complexity-bug
docs/improve-readme
refactor/extract-validators
```

## Testing

### Writing Tests

- Place tests in `tests/` directory within each package
- Use descriptive test names
- Test both happy paths and edge cases
- Mock external dependencies

### Example Test

```typescript
import { describe, it, expect } from 'vitest';
import { TypeScriptAnalyzer } from '../src/analyzers/typescript';

describe('TypeScriptAnalyzer', () => {
  const analyzer = new TypeScriptAnalyzer();
  
  describe('calculateComplexity', () => {
    it('should calculate complexity for if statements', () => {
      const code = `
        if (condition) {
          doSomething();
        }
      `;
      
      const complexity = analyzer.calculateComplexity(code);
      expect(complexity).toBeGreaterThan(0);
    });
    
    it('should handle empty files', () => {
      const complexity = analyzer.calculateComplexity('');
      expect(complexity).toBe(0);
    });
  });
});
```

### Running Your Tests

```bash
# Run specific test file
npm test -- tests/analyzers/typescript.test.ts

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

## Pull Request Process

### Before Submitting

1. **Update your fork**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/my-feature
   ```

3. **Make your changes**:
   - Write clear, focused commits
   - Add tests for new functionality
   - Update documentation as needed

4. **Run quality checks**:
   ```bash
   npm run lint
   npm test
   npm run build
   ```

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add my feature"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/my-feature
   ```

### Submitting the PR

1. Go to the [ADP repository](https://github.com/plures/ADP)
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill out the PR template:
   - Describe what the PR does
   - Link related issues
   - List breaking changes (if any)
   - Add screenshots (for UI changes)

### PR Review Process

- Maintainers will review your PR
- Address any requested changes
- Once approved, a maintainer will merge it
- Your contribution will be included in the next release!

## Contributing Language Support

### Adding a New Language Analyzer

1. **Create analyzer file**:
   ```
   packages/core/src/analyzers/your-language.ts
   ```

2. **Implement analyzer interface**:
   ```typescript
   export class YourLanguageAnalyzer implements LanguageAnalyzer {
     analyzeFile(filePath: string, content: string): FileAnalysis {
       // Implementation
     }
     
     calculateComplexity(content: string): number {
       // Implementation
     }
     
     extractDependencies(content: string): string[] {
       // Implementation
     }
   }
   ```

3. **Add tests**:
   ```
   packages/core/tests/analyzers/your-language.test.ts
   ```

4. **Create rule catalog**:
   ```
   docs/rules/your-language.md
   ```

5. **Add examples**:
   ```
   examples/your-language-example.ext
   ```

6. **Update documentation**:
   - Add to language list in README
   - Update multi-language usage docs

## Contributing Documentation

Documentation improvements are always welcome!

### Types of Documentation

- **Tutorials**: Step-by-step guides
- **How-To Guides**: Solutions to specific problems
- **Reference**: Rule catalogs, API docs
- **Explanations**: Concepts and design decisions

### Documentation Style

- Write clearly and concisely
- Use examples liberally
- Include code snippets
- Add screenshots when helpful
- Link to related documentation

## Getting Help

- **GitHub Discussions**: Ask questions and discuss ideas
- **GitHub Issues**: Report bugs and request features
- **Demos**: Check `demo/` directory for examples
- **Documentation**: Read `docs/` for detailed guides

## Recognition

Contributors are recognized in:
- Release notes
- CONTRIBUTORS.md file
- GitHub contributors page

## License

By contributing to ADP, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to ADP! 🎉
