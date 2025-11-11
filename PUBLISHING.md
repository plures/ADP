# Publishing Guide for ADP Packages

This guide explains how to publish ADP packages to npm and other registries.

## 🚀 Automated Publishing (Recommended)

ADP uses GitHub Actions workflows for automated publishing. This is the recommended approach for most releases.

### Automated Release with Changesets

1. **Create a changeset for your changes:**
   ```bash
   npm run changeset
   ```
   - Select which packages to version
   - Choose version bump type (patch/minor/major)
   - Write a description of changes

2. **Commit and push the changeset:**
   ```bash
   git add .changeset/
   git commit -m "docs: add changeset for release"
   git push origin main
   ```

3. **Automatic process:**
   - The Release Management workflow creates a "Version Packages" PR
   - Review and merge the PR
   - Upon merge, packages are automatically published to npm

### Manual Release via GitHub Releases

1. **Create and push a tag:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Create a GitHub Release:**
   - Go to GitHub → Releases → Draft a new release
   - Select your tag
   - Add release notes
   - Click "Publish release"

3. **Automatic process:**
   - The Publish workflow runs automatically
   - Builds all packages
   - Publishes to npm registry

### Setup Requirements

**First-time setup for automated publishing:**

1. Generate npm automation token at [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens)
2. Add as `NPM_TOKEN` secret in repository settings
3. Ensure packages have proper `publishConfig` (already configured)

See [.github/workflows/README.md](.github/workflows/README.md) for detailed workflow documentation.

## 📋 Manual Publishing

For manual publishing or when automated workflows are unavailable:

### Prerequisites

1. **npm Account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **npm Authentication**: Login via CLI: `npm login`
3. **Organization Access**: Request access to `@architectural-discipline` scope (or use your own scope)
4. **Build Successful**: Ensure all packages build without errors

### Publishing to npm

### Step 1: Build All Packages

```bash
# From root directory
npm run build
```

### Step 2: Version Management

Using changesets (recommended):

```bash
# Create a changeset
npm run changeset

# Version packages based on changesets
npm run version

# Publish packages
npm run release
```

Manual versioning:

```bash
# Update version in package.json for each package
cd packages/core
npm version patch  # or minor, major

cd ../cli
npm version patch

cd ../eslint-plugin
npm version patch

cd ../installer
npm version patch
```

### Step 3: Publish Individual Packages

```bash
# Publish core (publish this first as others depend on it)
cd packages/core
npm publish --access public

# Publish eslint-plugin
cd ../eslint-plugin
npm publish --access public

# Publish CLI
cd ../cli
npm publish --access public

# Publish installer
cd ../installer
npm publish --access public
```

### Step 4: Publish from Root (Using Workspaces)

```bash
# Publish all workspaces at once
npm publish --workspaces --access public
```

## Publishing Strategy

### Release Types

1. **Patch Release** (1.0.x) - Bug fixes, no breaking changes
2. **Minor Release** (1.x.0) - New features, backward compatible
3. **Major Release** (x.0.0) - Breaking changes

### Pre-release

For testing releases:

```bash
# Update to pre-release version
npm version prerelease --preid=beta

# Publish with beta tag
npm publish --tag beta --access public

# Install beta version
npm install @architectural-discipline/cli@beta
```

## Deno Compatibility

ADP packages work with Deno via npm: specifiers out of the box:

```typescript
// Deno can import npm packages directly
import { ArchitecturalAnalyzer } from "npm:@architectural-discipline/core@^1.0.0";
```

No special publishing steps needed for Deno support!

## Alternative Package Managers

### pnpm

```bash
# Users can install with pnpm
pnpm add -D @architectural-discipline/cli
```

### Yarn

```bash
# Users can install with yarn
yarn add -D @architectural-discipline/cli
```

### bun

```bash
# Users can install with bun
bun add -D @architectural-discipline/cli
```

All these work automatically once published to npm!

## GitHub Packages (Optional)

To also publish to GitHub Packages:

### 1. Setup Authentication

Create `.npmrc` in project root:

```
@architectural-discipline:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 2. Update package.json

Add `publishConfig`:

```json
{
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

### 3. Publish

```bash
npm publish
```

## CI/CD Publishing

### ✅ GitHub Actions Workflows (Already Configured)

This repository includes three automated workflows:

1. **CI Workflow** (`.github/workflows/ci.yml`)
   - Runs on every push and PR
   - Tests, builds, and validates all packages
   - Ensures code quality before merging

2. **Publish Workflow** (`.github/workflows/publish.yml`)
   - Triggers on GitHub Release creation
   - Automatically publishes to npm registry

3. **Release Management Workflow** (`.github/workflows/release.yml`)
   - Uses Changesets for version management
   - Creates version bump PRs
   - Auto-publishes when version PR is merged

**Note**: Workflows are already set up. You only need to configure the `NPM_TOKEN` secret.

See [.github/workflows/README.md](.github/workflows/README.md) for complete documentation.

### Setup NPM Token

1. Generate token at [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens)
2. Add as `NPM_TOKEN` secret in GitHub repository settings

## Verification After Publishing

### Test Installation

```bash
# Create test directory
mkdir test-install && cd test-install
npm init -y

# Install published package
npm install @architectural-discipline/cli

# Test it works
npx architectural-discipline --version
```

### Test with Different Package Managers

```bash
# Test with pnpm
pnpm add @architectural-discipline/cli
pnpm exec architectural-discipline --version

# Test with yarn
yarn add @architectural-discipline/cli
yarn architectural-discipline --version

# Test with Deno
deno run npm:@architectural-discipline/cli --version
```

### Test Offline Bundle

```bash
# Download offline bundle
npx @architectural-discipline/installer download-offline

# Verify contents
ls adp-offline/
cat adp-offline/README.md
```

## Rollback Process

If you need to unpublish or deprecate:

### Deprecate a Version

```bash
npm deprecate @architectural-discipline/cli@1.0.0 "This version has a critical bug, please upgrade to 1.0.1"
```

### Unpublish (within 72 hours)

```bash
npm unpublish @architectural-discipline/cli@1.0.0
```

**Note**: Unpublishing is not recommended and only works within 72 hours of publication.

## Package Registry Status

### npm Registry

- **Status**: ✅ Ready to publish
- **Scope**: `@architectural-discipline`
- **Access**: Public
- **URL**: https://www.npmjs.com/package/@architectural-discipline/cli

### Deno Deploy

- **Status**: ✅ Works via npm: specifier
- **No separate publishing needed**
- **Users can**: `deno run npm:@architectural-discipline/cli`

### GitHub Packages (Optional)

- **Status**: ⚙️ Can be configured
- **Requires**: GitHub token, publishConfig
- **URL**: https://github.com/architectural-discipline/monorepo/packages

## Security Considerations

1. **Use npm automation tokens** for CI/CD (not personal tokens)
2. **Enable 2FA** on npm account
3. **Review dependencies** before publishing
4. **Run security audits**: `npm audit`
5. **Sign packages** (optional): Configure with npm provenance

## Best Practices

1. **Always build before publishing**: `npm run build`
2. **Test locally first**: Use `npm link` for local testing
3. **Update CHANGELOG**: Document changes in each release
4. **Tag releases in git**: `git tag v1.0.0 && git push --tags`
5. **Update documentation**: Keep README and docs current
6. **Verify package contents**: Use `npm pack` to inspect before publishing

## Troubleshooting

### "You do not have permission to publish"

- Ensure you're logged in: `npm whoami`
- Check organization membership
- Verify package scope in package.json

### "Version already exists"

- Bump the version number
- Use `npm version` command

### "Package name too similar to existing package"

- Choose a different name or scope
- Use `@yourscope/package-name` format

## Support

For publishing issues:
- npm support: https://www.npmjs.com/support
- GitHub discussions: https://github.com/architectural-discipline/monorepo/discussions
- Issues: https://github.com/architectural-discipline/monorepo/issues
