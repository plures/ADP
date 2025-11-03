#!/usr/bin/env node
/**
 * @architectural-discipline/installer
 * 
 * Universal installer for adding ADP to any project type
 */

import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';
import ora from 'ora';
import { installOnline } from './install-online.js';
import { installOffline } from './install-offline.js';
import { detectProjectType, ProjectType } from './project-detection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name('adp-install')
  .description('Add Architectural Discipline Package to your project')
  .version('1.0.0');

/**
 * Main install command
 */
program
  .command('install')
  .description('Install ADP in current project')
  .option('--offline', 'Use offline installation (from local cache)')
  .option('--project-type <type>', 'Specify project type (auto-detected if not provided)')
  .option('--package-manager <pm>', 'Package manager to use (npm, yarn, pnpm)')
  .option('--skip-deps', 'Skip installing dependencies')
  .option('--minimal', 'Install minimal configuration only')
  .action(async (options) => {
    try {
      console.log(chalk.blue.bold('\n🎯 Architectural Discipline Package Installer\n'));

      const cwd = process.cwd();
      
      // Detect project type
      const spinner = ora('Detecting project type...').start();
      const detectedType = await detectProjectType(cwd);
      spinner.succeed(`Detected project type: ${chalk.yellow(detectedType)}`);

      const projectType = options.projectType || detectedType;

      // Confirm installation
      const { confirm } = await prompts({
        type: 'confirm',
        name: 'confirm',
        message: `Install ADP for ${projectType} project in ${cwd}?`,
        initial: true,
      });

      if (!confirm) {
        console.log(chalk.yellow('Installation cancelled.'));
        process.exit(0);
      }

      // Choose installation method
      if (options.offline) {
        spinner.start('Installing from offline cache...');
        await installOffline(cwd, projectType, options);
        spinner.succeed('Offline installation complete!');
      } else {
        spinner.start('Installing from npm registry...');
        await installOnline(cwd, projectType, options);
        spinner.succeed('Online installation complete!');
      }

      console.log(chalk.green.bold('\n✅ ADP installed successfully!\n'));
      
      // Display next steps
      displayNextSteps(projectType);

    } catch (error) {
      console.error(chalk.red('\n❌ Installation failed:'), error);
      process.exit(1);
    }
  });

/**
 * Init command (alias for install)
 */
program
  .command('init')
  .description('Initialize ADP in current project (alias for install)')
  .option('--offline', 'Use offline installation')
  .option('--project-type <type>', 'Specify project type')
  .option('--package-manager <pm>', 'Package manager to use')
  .action(async (options) => {
    // Redirect to install command
    await program.parseAsync(['install', ...process.argv.slice(3)], { from: 'user' });
  });

/**
 * Download offline bundle command
 */
program
  .command('download-offline')
  .description('Download offline installation bundle for air-gapped environments')
  .option('-o, --output <dir>', 'Output directory for offline bundle', './adp-offline')
  .action(async (options) => {
    try {
      console.log(chalk.blue.bold('\n📦 Downloading ADP offline bundle...\n'));

      const spinner = ora('Downloading packages...').start();
      
      const outputDir = path.resolve(options.output);
      await fs.ensureDir(outputDir);

      // Download all required packages
      const packages = [
        '@architectural-discipline/cli',
        '@architectural-discipline/core',
        '@architectural-discipline/eslint-plugin',
      ];

      for (const pkg of packages) {
        spinner.text = `Downloading ${pkg}...`;
        // Download package tarball
        await downloadPackage(pkg, outputDir);
      }

      // Create installation script
      await createOfflineInstaller(outputDir);

      spinner.succeed('Offline bundle created successfully!');
      
      console.log(chalk.green('\n✅ Offline bundle ready at:'), chalk.yellow(outputDir));
      console.log(chalk.cyan('\nTo install on air-gapped system:'));
      console.log(chalk.white('  1. Copy the entire folder to the target system'));
      console.log(chalk.white('  2. Run: node install-offline.js'));

    } catch (error) {
      console.error(chalk.red('\n❌ Download failed:'), error);
      process.exit(1);
    }
  });

/**
 * Display next steps after installation
 */
function displayNextSteps(projectType: ProjectType): void {
  console.log(chalk.cyan.bold('📚 Next Steps:\n'));

  switch (projectType) {
    case 'nodejs':
    case 'typescript':
      console.log(chalk.white('  1. Run analysis: npx architectural-discipline analyze'));
      console.log(chalk.white('  2. Get recommendations: npx architectural-discipline recommend'));
      console.log(chalk.white('  3. Check your scripts in package.json'));
      break;

    case 'deno':
      console.log(chalk.white('  1. Run analysis: deno run npm:@architectural-discipline/cli analyze'));
      console.log(chalk.white('  2. Check deno.json for configured tasks'));
      break;

    case 'powershell':
      console.log(chalk.white('  1. Import module: Import-Module ./.adp/adp.psm1'));
      console.log(chalk.white('  2. Run analysis: Invoke-ADPAnalysis'));
      break;

    case 'csharp':
      console.log(chalk.white('  1. Restore packages: dotnet restore'));
      console.log(chalk.white('  2. Build: dotnet build'));
      console.log(chalk.white('  3. Run analysis: dotnet adp analyze'));
      break;

    case 'rust':
      console.log(chalk.white('  1. Run analysis: cargo run --bin adp-analyze'));
      console.log(chalk.white('  2. Check Cargo.toml for configured scripts'));
      break;

    default:
      console.log(chalk.white('  1. Check the generated configuration files'));
      console.log(chalk.white('  2. Run: npx architectural-discipline analyze'));
  }

  console.log(chalk.white('\n  📖 Documentation: https://github.com/architectural-discipline/monorepo#readme'));
}

/**
 * Download a package from npm registry
 */
async function downloadPackage(packageName: string, outputDir: string): Promise<void> {
  const fetch = (await import('node-fetch')).default;
  
  // Get package info from npm registry
  const response = await fetch(`https://registry.npmjs.org/${packageName}`);
  const data = await response.json() as any;
  
  const latestVersion = data['dist-tags'].latest;
  const tarballUrl = data.versions[latestVersion].dist.tarball;
  
  // Download tarball
  const tarballResponse = await fetch(tarballUrl);
  const tarballPath = path.join(outputDir, `${packageName.replace('/', '-')}-${latestVersion}.tgz`);
  
  const buffer = await tarballResponse.arrayBuffer();
  await fs.writeFile(tarballPath, Buffer.from(buffer));
}

/**
 * Create offline installer script
 */
async function createOfflineInstaller(outputDir: string): Promise<void> {
  const installerScript = `#!/usr/bin/env node
/**
 * Offline ADP Installer
 * For air-gapped environments
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎯 Installing ADP from offline bundle...\\n');

const packages = fs.readdirSync(__dirname)
  .filter(f => f.endsWith('.tgz'));

console.log(\`Found \${packages.length} packages to install\\n\`);

packages.forEach(pkg => {
  console.log(\`Installing \${pkg}...\`);
  execSync(\`npm install \${path.join(__dirname, pkg)} --no-save\`, {
    stdio: 'inherit'
  });
});

console.log('\\n✅ ADP installed successfully!');
console.log('\\nRun: npx architectural-discipline --help');
`;

  await fs.writeFile(
    path.join(outputDir, 'install-offline.js'),
    installerScript,
    { mode: 0o755 }
  );

  // Create README
  const readme = `# ADP Offline Installation Bundle

This bundle contains all files needed to install Architectural Discipline Package (ADP) in air-gapped environments.

## Installation

1. Copy this entire folder to your target system
2. Navigate to this folder
3. Run the installation script:

\`\`\`bash
node install-offline.js
\`\`\`

or

\`\`\`bash
chmod +x install-offline.js
./install-offline.js
\`\`\`

## What's Included

- @architectural-discipline/cli
- @architectural-discipline/core
- @architectural-discipline/eslint-plugin

## Next Steps

After installation, you can use ADP:

\`\`\`bash
npx architectural-discipline analyze
npx architectural-discipline recommend
\`\`\`

## Support

For issues and documentation, visit:
https://github.com/architectural-discipline/monorepo
`;

  await fs.writeFile(path.join(outputDir, 'README.md'), readme);
}

// Parse command line arguments
program.parse();
