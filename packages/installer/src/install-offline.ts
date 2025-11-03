/**
 * Offline installation from local cache/tarball
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
 * Install ADP from offline cache
 */
export async function installOffline(
  projectPath: string,
  projectType: ProjectType,
  options: InstallOptions = {}
): Promise<void> {
  // Look for offline bundle
  const offlinePaths = [
    path.join(projectPath, 'adp-offline'),
    path.join(projectPath, '.adp-offline'),
    path.join(process.env.HOME || process.env.USERPROFILE || '', '.adp-offline'),
  ];
  
  let offlineDir: string | null = null;
  
  for (const dir of offlinePaths) {
    if (await fs.pathExists(dir)) {
      offlineDir = dir;
      break;
    }
  }
  
  if (!offlineDir) {
    throw new Error(
      'Offline bundle not found. Please download it first using: adp-install download-offline'
    );
  }
  
  console.log(chalk.gray(`Using offline bundle from: ${offlineDir}\n`));
  
  // Install packages from tarballs
  const tarballs = (await fs.readdir(offlineDir))
    .filter(f => f.endsWith('.tgz'));
  
  if (tarballs.length === 0) {
    throw new Error('No package tarballs found in offline bundle');
  }
  
  const packageManager = options.packageManager || 'npm';
  
  for (const tarball of tarballs) {
    const tarballPath = path.join(offlineDir, tarball);
    console.log(chalk.gray(`  Installing ${tarball}...`));
    
    const installCmd = packageManager === 'yarn'
      ? `yarn add -D file:${tarballPath}`
      : `${packageManager} install --save-dev ${tarballPath}`;
    
    try {
      execSync(installCmd, { cwd: projectPath, stdio: 'pipe' });
    } catch (error) {
      console.warn(chalk.yellow(`  Warning: Failed to install ${tarball}`));
    }
  }
  
  // Create configuration files (same as online)
  await createOfflineConfig(projectPath, projectType);
}

/**
 * Create configuration for offline installation
 */
async function createOfflineConfig(
  projectPath: string,
  projectType: ProjectType
): Promise<void> {
  const configPath = path.join(projectPath, '.adp-config.json');
  
  if (!(await fs.pathExists(configPath))) {
    const config = {
      'architectural-discipline': {
        version: '1.0.0',
        projectType,
        installType: 'offline',
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
