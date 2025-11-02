# Development Rules

## File Structure Rules
- Core analyzers must be language-agnostic where possible
- Language-specific logic should be isolated in dedicated modules
- All language implementations must follow the same interface

## Naming Conventions
- Language analyzers: `LanguageAnalyzer` (e.g., `PowerShellAnalyzer`, `CSharpAnalyzer`, `RustAnalyzer`)
- File type patterns: Language-specific patterns should be prefixed with language name
- Configuration: Language-specific configs should be in separate files

## Implementation Requirements
1. Each language analyzer must implement the `LanguageAnalyzer` interface
2. Each language must have its own file type patterns configuration
3. Function extraction must be language-aware
4. Complexity calculation must respect language-specific syntax

## Testing Requirements
- Unit tests for each language analyzer
- Integration tests for CLI with multiple languages
- Examples for each supported language

