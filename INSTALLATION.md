# ADP Installation Guide

This guide covers multiple methods for installing the Architectural Discipline Package (ADP) in your projects.

## 🚀 Quick Install

### Option 1: Using npx (Recommended - No Installation Required)

The easiest way to add ADP to any project:

```bash
# Navigate to your project directory
cd /path/to/your/project

# Run the installer
npx @architectural-discipline/installer install
```

This works with:
- Node.js/TypeScript projects
- Deno projects
- PowerShell modules
- C# projects
- Rust projects
- And more!

### Option 2: Using npm create

```bash
npm create adp@latest
```

### Option 3: Direct Package Installation

For Node.js/TypeScript projects:

```bash
# Using npm
npm install --save-dev @architectural-discipline/cli @architectural-discipline/core @architectural-discipline/eslint-plugin

# Using yarn
yarn add -D @architectural-discipline/cli @architectural-discipline/core @architectural-discipline/eslint-plugin

# Using pnpm
pnpm add -D @architectural-discipline/cli @architectural-discipline/core @architectural-discipline/eslint-plugin
```

### Option 4: Global Installation

Install the CLI globally:

```bash
npm install -g @architectural-discipline/cli
```

Then use it anywhere:

```bash
architectural-discipline analyze
architectural-discipline recommend
```

## 🌐 Deno Installation

ADP works with Deno out of the box using npm: specifiers:

### Method 1: Using deno.json

Add to your `deno.json`:

```json
{
  "tasks": {
    "adp:analyze": "deno run npm:@architectural-discipline/cli analyze",
    "adp:recommend": "deno run npm:@architectural-discipline/cli recommend"
  },
  "imports": {
    "@architectural-discipline/cli": "npm:@architectural-discipline/cli@^1.0.0"
  }
}
```

Then run:

```bash
deno task adp:analyze
```

### Method 2: Direct Execution

```bash
deno run npm:@architectural-discipline/cli analyze
```

## 🔒 Offline Installation (Air-Gapped Environments)

For systems without internet access:

### Step 1: Download Bundle (On Connected Machine)

```bash
npx @architectural-discipline/installer download-offline -o adp-bundle
```

This creates a folder with:
- All ADP packages as tarballs
- Installation script
- Documentation

### Step 2: Transfer to Air-Gapped System

Copy the entire `adp-bundle` folder to your target system using approved transfer methods (USB drive, internal network, etc.)

### Step 3: Install on Air-Gapped System

```bash
cd adp-bundle
node install-offline.js
```

Or use the installer:

```bash
npx @architectural-discipline/installer install --offline
```

## 📦 Language-Specific Installation

### PowerShell

```bash
# Install using the installer
npx @architectural-discipline/installer install

# This creates a PowerShell module at .adp/adp.psm1
# Import and use:
Import-Module ./.adp/adp.psm1
Invoke-ADPAnalysis -Path ./src
```

### C# (.NET)

```bash
# Install using the installer
npx @architectural-discipline/installer install

# This creates analysis scripts
# Run analysis:
./adp-analyze.sh
```

Or integrate with your build:

```xml
<!-- In your .csproj -->
<Target Name="ADPAnalysis" AfterTargets="Build">
  <Exec Command="npx @architectural-discipline/cli analyze" />
</Target>
```

### Rust

```bash
# Install using the installer
npx @architectural-discipline/installer install

# This adds Cargo aliases
# Run analysis:
cargo adp-analyze
cargo adp-recommend
```

## 🔧 Manual Installation

If you prefer manual setup:

### 1. Install Packages

```bash
npm install --save-dev @architectural-discipline/cli @architectural-discipline/core @architectural-discipline/eslint-plugin
```

### 2. Create Configuration

Create `.adp-config.json`:

```json
{
  "architectural-discipline": {
    "version": "1.0.0",
    "languages": {
      "typescript": {
        "maxLines": 300,
        "maxComplexity": 10
      }
    },
    "ignore": [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.test.*"
    ]
  }
}
```

### 3. Add Scripts to package.json

```json
{
  "scripts": {
    "adp:analyze": "architectural-discipline analyze",
    "adp:recommend": "architectural-discipline recommend",
    "adp:check": "architectural-discipline analyze --format json"
  }
}
```

### 4. Configure ESLint (Optional)

Create `eslint.config.js`:

```javascript
import architecturalDiscipline from '@architectural-discipline/eslint-plugin';

export default [
  architecturalDiscipline.configs.recommended,
  {
    rules: {
      '@architectural-discipline/max-lines': 'warn',
      '@architectural-discipline/max-complexity': 'warn',
    },
  },
];
```

## 🚀 Usage After Installation

### Run Analysis

```bash
# Using npm scripts (if configured)
npm run adp:analyze

# Direct CLI
npx architectural-discipline analyze

# With options
npx architectural-discipline analyze --path src --format json
```

### Get Recommendations

```bash
npm run adp:recommend

# Or
npx architectural-discipline recommend --priority high
```

### Create New Project

```bash
npx architectural-discipline create my-project --template web-app
```

## 📚 Next Steps

After installation:

1. **Run your first analysis**: `npm run adp:analyze`
2. **Review recommendations**: `npm run adp:recommend`
3. **Read the documentation**: Check out the [README](README.md) and [docs](docs/)
4. **Configure for your needs**: Edit `.adp-config.json`
5. **Integrate with CI/CD**: Add analysis to your build pipeline

## 🐛 Troubleshooting

### Installation Issues

**Problem**: `command not found: architectural-discipline`
- Solution: Ensure packages are installed or use `npx architectural-discipline`

**Problem**: Module not found errors
- Solution: Run `npm install` to ensure all dependencies are installed

**Problem**: TypeScript errors
- Solution: Ensure `tsconfig.json` is properly configured

### Offline Installation Issues

**Problem**: Cannot find offline bundle
- Solution: Ensure the bundle path is correct, check common locations:
  - `./adp-offline`
  - `./.adp-offline`
  - `~/.adp-offline`

**Problem**: Permission denied on install script
- Solution: Make the script executable: `chmod +x install-offline.js`

## 🔗 Additional Resources

- [Main Documentation](README.md)
- [CLI Reference](docs/cli-reference.md)
- [Multi-Language Usage](docs/multi-language-usage.md)
- [GitHub Repository](https://github.com/architectural-discipline/monorepo)
- [Issues & Support](https://github.com/architectural-discipline/monorepo/issues)

## 💡 Tips

- Use the auto-installer for the easiest setup
- For CI/CD, prefer direct package installation for better caching
- For air-gapped environments, keep the offline bundle up to date
- Use project-specific `.adp-config.json` to customize rules per project
