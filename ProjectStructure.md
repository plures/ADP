# Project Structure

## Package Organization
```
packages/
├── core/                    # Statistical analysis engine
│   ├── src/
│   │   ├── index.ts         # Main analyzer (language-agnostic)
│   │   ├── types.ts         # Core types
│   │   ├── languages/       # Language-specific analyzers
│   │   │   ├── typescript.ts
│   │   │   ├── powershell.ts
│   │   │   ├── csharp.ts
│   │   │   └── rust.ts
│   │   └── patterns/        # Language-specific file patterns
│   │       ├── typescript.ts
│   │       ├── powershell.ts
│   │       ├── csharp.ts
│   │       └── rust.ts
│   └── tests/
├── eslint-plugin/          # ESLint integration (TypeScript/JS only)
├── cli/                    # Command-line interface
└── templates/              # Project templates
```

## Language Support Files
Each language has:
- Analyzer implementation (`packages/core/src/languages/<lang>.ts`)
- File type patterns (`packages/core/src/patterns/<lang>.ts`)
- Tests (`packages/core/tests/languages/<lang>.test.ts`)

