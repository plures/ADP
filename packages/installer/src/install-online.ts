/**
 * Online installation from npm registry
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import type { ProjectType } from './project-detection.js';

interface InstallOptions {
  packageManager?: string;
  skipDeps?: boolean;
  minimal?: boolean;
}

/**
 * Install ADP packages from npm registry
 */
export async function installOnline(
  projectPath: string,
  projectType: ProjectType,
  options: InstallOptions = {}
): Promise<void> {
  const packageManager = options.packageManager || detectPackageManager(projectPath);
  
  // Install based on project type
  switch (projectType) {
    case 'nodejs':
    case 'typescript':
      await installForNodeJS(projectPath, packageManager, options);
      break;
      
    case 'deno':
      await installForDeno(projectPath, options);
      break;
      
    case 'powershell':
      await installForPowerShell(projectPath, options);
      break;
      
    case 'csharp':
      await installForCSharp(projectPath, options);
      break;
      
    case 'rust':
      await installForRust(projectPath, options);
      break;
      
    default:
      // Default to Node.js style installation
      await installForNodeJS(projectPath, packageManager, options);
  }
  
  // Create common configuration
  await createCommonConfig(projectPath, projectType, options);
}

/**
 * Detect which package manager to use
 */
function detectPackageManager(projectPath: string): string {
  // Check for lock files
  if (fs.existsSync(path.join(projectPath, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  
  if (fs.existsSync(path.join(projectPath, 'yarn.lock'))) {
    return 'yarn';
  }
  
  return 'npm';
}

/**
 * Install for Node.js/TypeScript projects
 */
async function installForNodeJS(
  projectPath: string,
  packageManager: string,
  options: InstallOptions
): Promise<void> {
  if (options.skipDeps) {
    return;
  }
  
  const packages = options.minimal
    ? ['@architectural-discipline/cli']
    : [
        '@architectural-discipline/cli',
        '@architectural-discipline/core',
        '@architectural-discipline/eslint-plugin',
      ];
  
  // Install packages
  const installCmd = packageManager === 'yarn'
    ? `yarn add -D ${packages.join(' ')}`
    : `${packageManager} install --save-dev ${packages.join(' ')}`;
  
  console.log(chalk.gray(`\n  Running: ${installCmd}\n`));
  execSync(installCmd, { cwd: projectPath, stdio: 'inherit' });
  
  // Update package.json scripts
  await updatePackageJsonScripts(projectPath);
  
  // Add ESLint config if not minimal
  if (!options.minimal) {
    await createESLintConfig(projectPath);
  }
}

/**
 * Install for Deno projects
 */
async function installForDeno(projectPath: string, options: InstallOptions): Promise<void> {
  const denoConfigPath = path.join(projectPath, 'deno.json');
  let denoConfig: any = {};
  
  if (await fs.pathExists(denoConfigPath)) {
    denoConfig = await fs.readJson(denoConfigPath);
  }
  
  // Add ADP tasks
  if (!denoConfig.tasks) {
    denoConfig.tasks = {};
  }
  
  denoConfig.tasks['adp:analyze'] = 'deno run npm:@architectural-discipline/cli analyze';
  denoConfig.tasks['adp:recommend'] = 'deno run npm:@architectural-discipline/cli recommend';
  
  await fs.writeJson(denoConfigPath, denoConfig, { spaces: 2 });
  
  console.log(chalk.green('✓ Added ADP tasks to deno.json'));
}

/**
 * Install for PowerShell projects
 */
async function installForPowerShell(
  projectPath: string,
  options: InstallOptions
): Promise<void> {
  // Create ADP PowerShell module wrapper
  const adpDir = path.join(projectPath, '.adp');
  await fs.ensureDir(adpDir);
  
  const moduleContent = `# ADP PowerShell Module
function Invoke-ADPAnalysis {
    [CmdletBinding()]
    param(
        [string]$Path = ".",
        [string]$Format = "text"
    )
    
    npx @architectural-discipline/cli analyze --path $Path --format $Format
}

function Get-ADPRecommendations {
    [CmdletBinding()]
    param(
        [string]$Path = ".",
        [ValidateSet('high', 'medium', 'low')]
        [string]$Priority
    )
    
    $cmd = "npx @architectural-discipline/cli recommend --path $Path"
    if ($Priority) {
        $cmd += " --priority $Priority"
    }
    
    Invoke-Expression $cmd
}

Export-ModuleMember -Function Invoke-ADPAnalysis, Get-ADPRecommendations
`;
  
  await fs.writeFile(path.join(adpDir, 'adp.psm1'), moduleContent);
  
  console.log(chalk.green('✓ Created PowerShell module at .adp/adp.psm1'));
}

/**
 * Install for C# projects
 */
async function installForCSharp(projectPath: string, options: InstallOptions): Promise<void> {
  // For C#, we'll add a .NET tool reference
  // Create a local tool manifest if it doesn't exist
  const toolManifestDir = path.join(projectPath, '.config');
  await fs.ensureDir(toolManifestDir);
  
  // Create a simple script to run ADP
  const scriptContent = `#!/usr/bin/env bash
# ADP Analysis Script for C# projects

npx @architectural-discipline/cli analyze --path . "$@"
`;
  
  const scriptPath = path.join(projectPath, 'adp-analyze.sh');
  await fs.writeFile(scriptPath, scriptContent, { mode: 0o755 });
  
  console.log(chalk.green('✓ Created analysis script at adp-analyze.sh'));
}

/**
 * Install for Rust projects
 */
async function installForRust(projectPath: string, options: InstallOptions): Promise<void> {
  // Add ADP scripts to Cargo.toml as aliases
  const cargoTomlPath = path.join(projectPath, 'Cargo.toml');
  
  if (await fs.pathExists(cargoTomlPath)) {
    let cargoContent = await fs.readFile(cargoTomlPath, 'utf-8');
    
    if (!cargoContent.includes('[alias]')) {
      cargoContent += '\n\n[alias]\n';
      cargoContent += 'adp-analyze = "!npx @architectural-discipline/cli analyze"\n';
      cargoContent += 'adp-recommend = "!npx @architectural-discipline/cli recommend"\n';
      
      await fs.writeFile(cargoTomlPath, cargoContent);
      console.log(chalk.green('✓ Added ADP aliases to Cargo.toml'));
    }
  }
}

/**
 * Update package.json with ADP scripts
 */
async function updatePackageJsonScripts(projectPath: string): Promise<void> {
  const packageJsonPath = path.join(projectPath, 'package.json');
  
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);
    
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    packageJson.scripts['adp:analyze'] = 'architectural-discipline analyze';
    packageJson.scripts['adp:recommend'] = 'architectural-discipline recommend';
    packageJson.scripts['adp:check'] = 'architectural-discipline analyze --format json';
    
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    
    console.log(chalk.green('✓ Added ADP scripts to package.json'));
  }
}

/**
 * Create ESLint configuration
 */
async function createESLintConfig(projectPath: string): Promise<void> {
  const eslintConfigPath = path.join(projectPath, 'eslint.config.js');
  
  // Only create if it doesn't exist
  if (!(await fs.pathExists(eslintConfigPath))) {
    const configContent = `import architecturalDiscipline from '@architectural-discipline/eslint-plugin';

export default [
  architecturalDiscipline.configs.recommended,
  {
    rules: {
      '@architectural-discipline/max-lines': 'warn',
      '@architectural-discipline/max-complexity': 'warn',
    },
  },
];
`;
    
    await fs.writeFile(eslintConfigPath, configContent);
    console.log(chalk.green('✓ Created eslint.config.js'));
  }
}

/**
 * Create common ADP configuration
 */
async function createCommonConfig(
  projectPath: string,
  projectType: ProjectType,
  options: InstallOptions
): Promise<void> {
  const configPath = path.join(projectPath, '.adp-config.json');
  
  // Only create if it doesn't exist
  if (!(await fs.pathExists(configPath))) {
    const config = {
      'architectural-discipline': {
        version: '1.0.0',
        projectType,
        languages: getLanguageConfig(projectType),
        ignore: [
          '**/node_modules/**',
          '**/dist/**',
          '**/build/**',
          '**/*.test.*',
          '**/*.spec.*',
        ],
      },
    };
    
    await fs.writeJson(configPath, config, { spaces: 2 });
    console.log(chalk.green('✓ Created .adp-config.json'));
  }
}

/**
 * Get language-specific configuration
 */
function getLanguageConfig(projectType: ProjectType): any {
  const configs: Record<string, any> = {
    typescript: {
      typescript: { maxLines: 300, maxComplexity: 10 },
    },
    nodejs: {
      javascript: { maxLines: 300, maxComplexity: 10 },
    },
    powershell: {
      powershell: { maxLines: 400, maxComplexity: 12 },
    },
    csharp: {
      csharp: { maxLines: 500, maxComplexity: 15 },
    },
    rust: {
      rust: { maxLines: 500, maxComplexity: 10 },
    },
  };
  
  return configs[projectType] || configs.nodejs;
}
