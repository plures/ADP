# ADP Installer

Universal installer for adding Architectural Discipline Package (ADP) to any project type.

## 🚀 Quick Start

### Online Installation (Recommended)

Using npx (no installation required):

```bash
# In your project directory
npx @architectural-discipline/installer install
```

Or using npm create:

```bash
npm create adp@latest
```

### Offline Installation (Air-Gapped Environments)

1. Download the offline bundle (on a connected machine):

```bash
npx @architectural-discipline/installer download-offline
```

2. Copy the `adp-offline` folder to your air-gapped system

3. Run the offline installer:

```bash
cd adp-offline
node install-offline.js
```

Or use the installer:

```bash
npx @architectural-discipline/installer install --offline
```

## 📦 Supported Project Types

The installer automatically detects and supports:

- **Node.js / TypeScript** - Adds to package.json, creates ESLint config
- **Deno** - Configures deno.json tasks
- **PowerShell** - Creates PowerShell module wrappers
- **C#** - Adds analysis scripts for .NET projects
- **Rust** - Configures Cargo.toml aliases
- **Python** - Creates analysis scripts
- **Go** - Creates analysis scripts

## 🛠️ Usage

### Install Command

```bash
npx @architectural-discipline/installer install [options]
```

Options:
- `--offline` - Use offline installation from local cache
- `--project-type <type>` - Specify project type (auto-detected if not provided)
- `--package-manager <pm>` - Package manager to use (npm, yarn, pnpm)
- `--skip-deps` - Skip installing dependencies
- `--minimal` - Install minimal configuration only

### Initialize (Alias)

```bash
npx @architectural-discipline/installer init
```

### Download Offline Bundle

```bash
npx @architectural-discipline/installer download-offline [options]
```

Options:
- `-o, --output <dir>` - Output directory (default: ./adp-offline)

## 📋 What Gets Installed

### All Projects

- `.adp-config.json` - Configuration file with language-specific settings
- Analysis and recommendation tools

### Node.js/TypeScript Projects

- `@architectural-discipline/cli` (dev dependency)
- `@architectural-discipline/core` (dev dependency)
- `@architectural-discipline/eslint-plugin` (dev dependency)
- Updated `package.json` scripts:
  - `adp:analyze` - Run architecture analysis
  - `adp:recommend` - Get refactoring recommendations
  - `adp:check` - Analysis in JSON format
- `eslint.config.js` - ESLint configuration (if not present)

### Deno Projects

- Tasks in `deno.json`:
  - `adp:analyze` - Run analysis
  - `adp:recommend` - Get recommendations

### PowerShell Projects

- `.adp/adp.psm1` - PowerShell module with:
  - `Invoke-ADPAnalysis` - Run analysis
  - `Get-ADPRecommendations` - Get recommendations

### C# Projects

- `adp-analyze.sh` - Analysis script

### Rust Projects

- Cargo aliases in `Cargo.toml`:
  - `cargo adp-analyze`
  - `cargo adp-recommend`

## 🌐 Publishing Support

The ADP packages are published to:

- **npm** - Main distribution channel
- Can be used with **Deno** via npm: specifiers
- Compatible with **pnpm**, **yarn**, and **bun**

## 🔒 Offline/Air-Gapped Installation

For environments without internet access:

1. On a connected machine, download the offline bundle:
   ```bash
   npx @architectural-discipline/installer download-offline -o /path/to/bundle
   ```

2. The bundle includes:
   - All required npm packages as tarballs
   - Installation script
   - Documentation

3. Transfer the bundle to the air-gapped system

4. Run the installation:
   ```bash
   cd /path/to/bundle
   node install-offline.js
   ```

## 📖 Next Steps

After installation:

1. **Run Analysis**
   ```bash
   npm run adp:analyze
   # or
   npx architectural-discipline analyze
   ```

2. **Get Recommendations**
   ```bash
   npm run adp:recommend
   # or
   npx architectural-discipline recommend
   ```

3. **Check Documentation**
   - [Core Concepts](../../docs/core-concepts.md)
   - [CLI Reference](../../docs/cli-reference.md)
   - [Multi-Language Usage](../../docs/multi-language-usage.md)

## 🤝 Contributing

Contributions are welcome! Please see the main [Contributing Guide](../../CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](../../LICENSE) for details.

## 🔗 Links

- [GitHub Repository](https://github.com/architectural-discipline/monorepo)
- [Documentation](https://github.com/architectural-discipline/monorepo#readme)
- [Issues](https://github.com/architectural-discipline/monorepo/issues)
