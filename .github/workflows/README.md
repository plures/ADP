# GitHub Actions Workflows

This directory contains automated workflows for the ADP monorepo.

## Workflows

### 1. CI Workflow (`ci.yml`)

**Trigger**: Push or Pull Request to `main` or `develop` branches

**Purpose**: Continuous Integration - validates all changes before merging

**Jobs**:
- **Test and Build**: Runs on Node.js 18.x and 20.x
  - Installs dependencies
  - Lints code
  - Builds all packages (core first, then others)
  - Runs test suites
  - Checks architectural discipline metrics
  
- **Security**: Runs security audit on dependencies

### 2. Publish Workflow (`publish.yml`)

**Trigger**: GitHub Release created

**Purpose**: Publishes packages to npm registry when a release is created

**Jobs**:
- **Publish Packages**:
  - Builds all packages
  - Runs tests
  - Publishes to npm registry with public access
  - Creates publication summary

**Requirements**: 
- `NPM_TOKEN` secret must be configured in repository settings
- Packages must have proper version numbers

### 3. Release Management Workflow (`release.yml`)

**Trigger**: Push to `main` branch

**Purpose**: Automated version management using Changesets

**Jobs**:
- **Create Release PR or Publish**:
  - Uses Changesets to manage versions
  - Creates a PR to update version numbers when changesets exist
  - Automatically publishes to npm when the version PR is merged

**Requirements**: 
- `NPM_TOKEN` secret must be configured in repository settings
- Changesets must be added for changes: `npm run changeset`

## Setup Instructions

### 1. Configure npm Token

To enable publishing to npm:

1. Create an npm automation token at [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens)
   - Select "Automation" token type for CI/CD
   - Enable 2FA on your account for security

2. Add the token to GitHub:
   - Go to repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your npm token

### 2. Using Changesets for Versioning

To create a new release:

1. Make your changes
2. Create a changeset:
   ```bash
   npm run changeset
   ```
3. Select packages to version
4. Choose version bump type (patch/minor/major)
5. Write a description of changes
6. Commit the changeset file
7. Push to main branch

The Release Management workflow will:
- Create a PR with version bumps
- Update CHANGELOG files
- After merging, automatically publish to npm

### 3. Manual Release Process

For manual releases using GitHub Releases:

1. Create and push a git tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. Go to GitHub → Releases → Draft a new release
3. Select the tag you created
4. Add release notes
5. Click "Publish release"

The Publish workflow will automatically run and publish packages to npm.

## Workflow Status Badges

Add these badges to your README to show workflow status:

```markdown
![CI](https://github.com/architectural-discipline/monorepo/workflows/CI/badge.svg)
![Publish](https://github.com/architectural-discipline/monorepo/workflows/Publish%20to%20npm/badge.svg)
```

## Troubleshooting

### "You do not have permission to publish"

- Ensure `NPM_TOKEN` secret is set correctly
- Verify npm token has publish permissions
- Check that you're a member of the `@architectural-discipline` organization on npm

### Build Failures

- Check that all dependencies are properly declared
- Ensure core package builds first (it's a dependency for other packages)
- Review CI logs for specific error messages

### Publishing Wrong Version

If you accidentally publish the wrong version:

1. Deprecate the bad version:
   ```bash
   npm deprecate @architectural-discipline/cli@1.0.0 "Accidental publish, use 1.0.1 instead"
   ```

2. Publish the correct version with a new release

**Note**: Unpublishing is only possible within 72 hours and not recommended.

## Package Registry Configuration

All packages are configured with `publishConfig`:

```json
{
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

This ensures packages are:
- Published as public (required for scoped packages)
- Sent to the npm registry (not accidentally to GitHub Packages)

## Additional Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Repository PUBLISHING.md](../../PUBLISHING.md)
